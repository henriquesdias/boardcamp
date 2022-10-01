import express from "express";

import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomerById,
} from "../controllers/customersControllers.js";

const customersRouter = express.Router();
customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post("/customers", createCustomer);
customersRouter.put("/customers/:id", updateCustomerById);

export default customersRouter;
