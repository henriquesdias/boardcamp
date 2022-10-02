import connection from "../database/database.js";

async function createRental(req, res) {
  const date = new Date();
  const today = `${date.toLocaleString("defalt", {
    year: "numeric",
  })}-${date.toLocaleString("default", {
    month: "2-digit",
  })}-${date.toLocaleString("default", { day: "2-digit" })}`;
  const { customerId, gameId, daysRented } = res.locals.info;
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
  try {
    const rentals = await connection.query("SELECT * FROM rentals;");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export { createRental, getRentals };
