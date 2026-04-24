require("dotenv").config();
const { Client } = require("pg");

const initCategories = `
  DROP TABLE IF EXISTS categories;

  CREATE TABLE categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY;
    name TEXT UNIQUE,
    description TEXT,
  )
  INSERT INTO categories (name, description)
  VALUES
`;

const initProducts = `
DROP TABLE IF EXISTS products;

CREATE TABLE items (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT UNIQUE,
    brand TEXT,
    price NUMERIC(10,2),
    quantity INTEGER,
    description TEXT,
    image_url TEXT,
    category_id INTEGER REFERENCES categories(id)
);
INSERT INTO items (name, brand, price, stock, description, image_url, category_id)
VALUES
`;

const main = async () => {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  await client.connect();
  await client.query(initCategories);
  await client.query(initProducts);
  await client.end();
};
main();
