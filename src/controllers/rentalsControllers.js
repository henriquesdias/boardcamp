import connection from "../database/database.js";

import dayjs from "dayjs";

async function createRental(req, res) {
  const { customerId, gameId, daysRented } = res.locals.info;
  const today = dayjs().format("YYYY-MM-DD");
  try {
    const customer = await connection.query(
      "SELECT * FROM customers WHERE id = $1",
      [customerId]
    );
    if (customer.rows.length === 0) {
      return res.sendStatus(400);
    }
    const game = await connection.query("SELECT * FROM games WHERE id = $1;", [
      gameId,
    ]);
    if (game.rows.length === 0) {
      return res.sendStatus(400);
    }
    const rentals = await connection.query(
      'SELECT * FROM rentals WHERE "gameId" = $1 and "returnDate" IS NULL',
      [gameId]
    );
    if (rentals.rows.length >= game.rows[0].stockTotal) {
      return res.sendStatus(400);
    }
    const totalPrice = game.rows[0].pricePerDay * daysRented;
    await connection.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [customerId, gameId, today, daysRented, null, totalPrice.toString(), null]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
async function getRentals(req, res) {
  const customerId = req.query.customerId;
  const gameId = req.query.gameId;
  try {
    if (customerId !== undefined && gameId !== undefined) {
      const rentals = await connection.query(
        `SELECT rentals.*, JSON_BUILD_OBJECT('id', customers.id,'name',customers.name) AS customer, JSON_BUILD_OBJECT('id',games.id,'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON games.id = rentals."gameId" JOIN categories ON games."categoryId" = categories.id WHERE "customerId" = $1 and "gameId" = $2;
        `,
        [customerId, gameId]
      );
      return res.send(rentals.rows);
    }
    if (gameId !== undefined) {
      const rentals = await connection.query(
        `SELECT rentals.*, JSON_BUILD_OBJECT('id', customers.id,'name',customers.name) AS customer, JSON_BUILD_OBJECT('id',games.id,'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON games.id = rentals."gameId" JOIN categories ON games."categoryId" = categories.id WHERE "gameId" = $1;
        `,
        [gameId]
      );
      return res.send(rentals.rows);
    }
    if (customerId !== undefined) {
      const rentals = await connection.query(
        `SELECT rentals.*, JSON_BUILD_OBJECT('id', customers.id,'name',customers.name) AS customer, JSON_BUILD_OBJECT('id',games.id,'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON games.id = rentals."gameId" JOIN categories ON games."categoryId" = categories.id WHERE "customerId" = $1;
        `,
        [customerId]
      );
      return res.send(rentals.rows);
    }
    const rentals = await connection.query(
      `SELECT rentals.*, JSON_BUILD_OBJECT('id', customers.id,'name',customers.name) AS customer, JSON_BUILD_OBJECT('id',games.id,'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS game FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON games.id = rentals."gameId" JOIN categories ON games."categoryId" = categories.id;
      `
    );

    res.send(rentals.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
async function deleteRental(req, res) {
  const { id } = req.params;
  try {
    const rental = await connection.query(
      "SELECT * FROM rentals WHERE id = $1",
      [id]
    );
    if (rental.rows.length === 0) {
      return res.sendStatus(404);
    }
    if (rental.rows[0].returnDate === null) {
      return res.sendStatus(400);
    }
    await connection.query("DELETE FROM rentals WHERE id = $1;", [id]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
async function finalizeRental(req, res) {
  const { id } = req.params;
  const now = dayjs().format("YYYY-MM-DD");
  try {
    const rental = await connection.query(
      "SELECT * FROM rentals WHERE id = $1",
      [id]
    );
    if (rental.rows.length === 0) {
      return res.sendStatus(404);
    }
    if (rental.rows[0].returnDate !== null) {
      return res.sendStatus(400);
    }
    const { daysRented, rentDate, originalPrice } = rental.rows[0];
    const add = dayjs(rentDate).add(daysRented, "day");
    const deadline = add.format("YYYY-MM-DD");
    const timestampDeadline = new Date(deadline).getTime();
    const timestampNow = new Date().getTime();
    if (timestampDeadline - timestampNow >= 0) {
      const days = (timestampDeadline - timestampNow) / (1000 * 60 * 60 * 24);
      await connection.query(
        'UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3',
        [now, 0, id]
      );
      return res.sendStatus(200);
    }
    const daysDelay = Math.round(
      (timestampNow - timestampDeadline) / (1000 * 60 * 60 * 24)
    );
    await connection.query(
      'UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3',
      [now, Number(originalPrice) * daysDelay, id]
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export { createRental, getRentals, deleteRental, finalizeRental };
