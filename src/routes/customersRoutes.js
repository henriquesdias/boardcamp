import express from "express";

import {
  getCustomers,
  getCustomerById,
  createCustomer,
} from "../controllers/customersControllers.js";

const customersRouter = express.Router();
customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post("/customers", createCustomer);

export default customersRouter;
