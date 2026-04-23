const pool = require("./pool");

exports.getAll = async () => {
  const { rows } = await pool.query("SELECT * FROM messages");
  return rows;
};

exports.insertMsg = async (text, name) => {
  await pool.query("INSERT INTO messages(text,username) VALUES($1,$2)", [
    text,
    name,
  ]);
};

exports.findMsg = async (id) => {
  const { rows } = await pool.query("SELECT * FROM messages WHERE id = $1", [
    id,
  ]);
  return rows[0];
};
