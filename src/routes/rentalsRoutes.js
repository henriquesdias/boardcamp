import express from "express";

import { createRental } from "../controllers/rentalsControllers.js";
import schemaRentalValidate from "../middlewares/schemaRental.js";

const rentalsRouter = express.Router();
rentalsRouter.post("/rentals", schemaRentalValidate, createRental);

export default rentalsRouter;
