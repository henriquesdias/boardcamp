import connection from "../database/database.js";

import joi from "joi";

const schemaRental = joi.object({
  customerId: joi.number().required().min(1),
  gameId: joi.number().required().min(1),
  daysRented: joi.number().required().min(1),
});

async function createRental(req, res) {
  res.send("tudo de boassss");
}

export { createRental };
