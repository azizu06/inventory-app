const pool = require("./pool");

exports.getCategories = async () => {
  const { rows } = await pool.query(`SELECT * FROM categories`);
  return rows;
};

exports.getProducts = async (filters) => {
  const { search, categories, name, price } = filters;
  let sql = `
    SELECT p.*, c.name as category
    FROM products p
    JOIN categories c ON p.category_id = c.id
  `;
  const conditions = [];
  const values = [];
  const sorts = [];
  if (search) {
    values.push(`%${search}%`);
    conditions.push(`p.name ILIKE $${values.length}`);
  }

  if (categories && categories.length > 0) {
    values.push(categories);
    conditions.push(`c.name = ANY($${values.length})`);
  }
  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  if (price === "asc") {
    sorts.push(`p.price ASC`);
  } else if (price === "desc") {
    sorts.push(`p.price DESC`);
  }

  if (name === "asc") {
    sorts.push(`p.name ASC`);
  } else if (name === "desc") {
    sorts.push(`p.name DESC`);
  }
  if (sorts.length > 0) {
    sql += ` ORDER BY ${sorts.join(", ")}`;
  }

  const { rows } = await pool.query(sql, values);
  return rows;
};

exports.addProduct = async (product) => {
  const { name, price, quantity, brand, description, category_id, image_url } =
    product;
  const values = [
    name,
    brand,
    price,
    quantity,
    description,
    image_url,
    category_id,
  ];
  const sql = `
    INSERT INTO products
      (name, brand, price, quantity, description, image_url, category_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const { rows } = await pool.query(sql, values);
  return rows[0];
};

exports.addCategory = async (category) => {
  const { name, description } = category;
  const values = [name, description];
  const sql = `
    INSERT INTO categories (name, description)
    VALUES ($1, $2)
    RETURNING *
  `;
  const { rows } = await pool.query(sql, values);
  return rows[0];
};

exports.editProduct = async (product, id) => {
  const { name, price, quantity, brand, description, category_id, image_url } =
    product;
  const values = [
    name,
    brand,
    price,
    quantity,
    description,
    image_url,
    category_id,
    id,
  ];
  const sql = `
    UPDATE products
    SET name = $1,
        brand = $2,
        price = $3,
        quantity $4,
        description = $5,
        image_url = $6,
        category_id = $7
    WHERE id = $8
    RETURNING *
  `;
  const { rows } = await pool.query(sql, values);
  return rows[0];
};

exports.deleteProduct = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM products WHERE id = $1 RETURNING *`,
    [id],
  );
  return rows[0];
};

exports.deleteCategory = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM categories WHERE id = $1 RETURNING *`,
    [id],
  );
  return rows[0];
};

exports.findProduct = async (id) => {
  const { rows } = await pool.query(
    `SELECT p.*, c.name as category
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1`,
    [id],
  );
  return rows[0];
};
