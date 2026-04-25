require("dotenv").config();
const { Client } = require("pg");
const { categories, products } = require("./seedData");

const createTables = `
  DROP TABLE IF EXISTS products;
  DROP TABLE IF EXISTS categories;

  CREATE TABLE categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT UNIQUE,
    description TEXT
  );

  CREATE TABLE products (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT UNIQUE,
    brand TEXT,
    price NUMERIC(10,2),
    quantity INTEGER,
    description TEXT,
    image_url TEXT,
    category_id INTEGER REFERENCES categories(id)
  );
`;

const main = async () => {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  try {
    await client.query("BEGIN");
    await client.query(createTables);

    const categoryMap = new Map();

    for (const category of categories) {
      const { rows } = await client.query(
        `
          INSERT INTO categories (name, description)
          VALUES ($1, $2)
          RETURNING id, name
        `,
        [category.name, category.description],
      );

      categoryMap.set(rows[0].name, rows[0].id);
    }

    for (const product of products) {
      const categoryId = categoryMap.get(product.category);

      await client.query(
        `
          INSERT INTO products
            (name, brand, price, quantity, description, image_url, category_id)
          VALUES
            ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          product.name,
          product.brand,
          product.price,
          product.quantity,
          product.description,
          product.image_url,
          categoryId,
        ],
      );
    }

    await client.query("COMMIT");
    console.log(`Seeded ${categories.length} categories.`);
    console.log(`Seeded ${products.length} products.`);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
