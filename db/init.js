require("dotenv").config();
const { Client } = require("pg");

const initCategories = `
  DROP TABLE IF EXISTS categories;

  CREATE TABLE categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY;
    name TEXT,
    description TEXT,
  )
  INSERT INTO categories (name, description)
  VALUES
`;

const initItems = `
DROP TABLE IF EXISTS items;

CREATE TABLE items (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT,
    brand TEXT,
    price NUMERIC(10,2),
    stock INTEGER,
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
  await client.query(initItems);
  await client.end();
};
main();
