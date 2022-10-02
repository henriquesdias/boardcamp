import connection from "../database/database.js";

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
  const { name, phone, cpf, birthday } = res.locals.info;
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
async function updateCustomerById(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = res.locals.info;
  try {
    const customer = await connection.query(
      "SELECT * FROM customers WHERE cpf = $1;",
      [cpf]
    );
    if (customer.rows.length !== 0) {
      return res.sendStatus(409);
    }
    await connection.query(
      "UPDATE customers SET name = $1 , phone = $2 , cpf = $3 , birthday = $4 WHERE id = $5;",
      [name, phone, cpf, birthday, id]
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
export { getCustomers, getCustomerById, createCustomer, updateCustomerById };
