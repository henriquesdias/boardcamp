import express from "express";

import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomerById,
} from "../controllers/customersControllers.js";
import schemaCustomerValidate from "../middlewares/schemaCustomer.js";

const customersRouter = express.Router();
customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post("/customers", schemaCustomerValidate, createCustomer);
customersRouter.put(
  "/customers/:id",
  schemaCustomerValidate,
  updateCustomerById
);

export default customersRouter;
