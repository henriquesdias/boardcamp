import connection from "../database/database.js";

import joi from "joi";

const schemaGame = joi.object({
  name: joi.string().required().trim(),
  image: joi.string().required().trim(),
  stockTotal: joi.number().min(1).integer().required(),
  categoryId: joi.number().integer().required(),
  pricePerDay: joi.number().min(1).required(),
});

async function createGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
  const validation = schemaGame.validate(
    {
      name,
      image,
      stockTotal,
      categoryId,
      pricePerDay,
    },
    { abortEarly: false }
  );
  if (validation.error) {
    return res.status(400).send(validation.error.details.map((e) => e.message));
  }
  try {
    const game = await connection.query("SELECT * FROM games WHERE name = $1", [
      name,
    ]);
    if (game.rows.length !== 0) {
      return res.sendStatus(409);
    }
    const categories = await connection.query(
      "SELECT * FROM categories WHERE id = $1",
      [categoryId]
    );
    if (categories.rows.length === 0) {
      return res.sendStatus(400);
    }
    await connection.query(
      'INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay") VALUES ($1,$2,$3,$4,$5)',
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
async function getGames(req, res) {
  const filter = req.query.name;
  try {
    if (filter) {
      const games = connection.query(
        'SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE UPPER(games.name) LIKE $1;',
        [`${filter.toUpperCase()}%`]
      );
      return res.send(games);
    }
    const games = await connection.query(
      'SELECT games.*, categories.name as "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;'
    );
    res.send(games.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
export { createGame, getGames };
