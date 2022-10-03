import connection from "../database/database.js";

async function getCategories(req, res) {
  try {
    const categories = await connection.query("SELECT * FROM categories;");
    res.send(categories.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
async function createCategories(req, res) {
  const { name } = res.locals.info;
  try {
    const categorie = await connection.query(
      "SELECT * FROM categories WHERE name = $1",
      [name]
    );
    if (categorie.rows.length !== 0) {
      return res.sendStatus(409);
    }
    await connection.query("INSERT INTO categories (name) VALUES ($1)", [name]);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
export { getCategories, createCategories };
