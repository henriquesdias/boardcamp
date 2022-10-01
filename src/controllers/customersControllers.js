import connection from "../database/database.js";

import joi from "joi";

const schemaCustomer = joi.object({
  name: joi.string().required().trim(),
  phone: joi.string().min(10).max(11).required().trim(),
  cpf: joi.string().required().trim().length(11),
  birthday: joi.date().required(),
});

async function getCustomers(req, res) {
  const filter = req.query.cpf;
  try {
    if (filter !== undefined) {
      const filteredCustomers = await connection.query(
        "SELECT * FROM customers WHERE cpf LIKE $1;",
        [`${filter}%`]
      );
      return res.send(filteredCustomers.rows);
    }
    const customers = await connection.query("SELECT * FROM customers;");
    res.send(customers.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
async function getCustomerById(req, res) {
  const { id } = req.params;
  try {
    const customer = await connection.query(
      "SELECT * FROM customers WHERE id = $1",
      [id]
    );
    if (customer.rows.length === 0) {
      return res.sendStatus(404);
    }
    res.send(customer.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
async function createCustomer(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  const validation = schemaCustomer.validate(
    { name, phone, cpf, birthday },
    { abortEarly: false }
  );
  if (validation.error) {
    res.status(400).send(validation.error.details.map((e) => e.message));
  }
  try {
    const customer = await connection.query(
      "SELECT * FROM customers WHERE cpf = $1",
      [cpf]
    );
    if (customer.rows.length !== 0) {
      return res.sendStatus(409);
    }
    await connection.query(
      "INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1, $2, $3, $4)",
      [name, phone, cpf, birthday]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
  res.send({ name, phone, cpf, birthday });
}
export { getCustomers, getCustomerById, createCustomer };
