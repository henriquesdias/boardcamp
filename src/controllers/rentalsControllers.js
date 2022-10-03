import connection from "../database/database.js";

async function createRental(req, res) {
  const { customerId, gameId, daysRented } = res.locals.info;
  const date = new Date();
  const today = `${date.toLocaleString("default", {
    year: "numeric",
  })}-${date.toLocaleString("default", {
    month: "2-digit",
  })}-${date.toLocaleString("default", { day: "2-digit" })}`;
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
  const date = new Date();
  const today = `${date.toLocaleString("default", {
    year: "numeric",
  })}-${date.toLocaleString("default", {
    month: "2-digit",
  })}-${date.toLocaleString("default", { day: "2-digit" })}`;
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
    // const dateOfReturn = today.split("-");
    // dateOfReturn[2] = (Number(dateOfReturn[2]) + Number(daysRented)).toString();
    // console.log(date.getTime(rentDate));

    console.log(rentDate.getDay());
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export { createRental, getRentals, deleteRental, finalizeRental };
