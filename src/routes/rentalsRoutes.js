import express from "express";

import {
  createRental,
  getRentals,
  deleteRental,
  finalizeRental,
} from "../controllers/rentalsControllers.js";
import schemaRentalValidate from "../middlewares/schemaRental.js";

const rentalsRouter = express.Router();
rentalsRouter.post("/rentals", schemaRentalValidate, createRental);
rentalsRouter.get("/rentals", getRentals);
rentalsRouter.delete("/rentals/:id", deleteRental);
rentalsRouter.post("/rentals/:id/return", finalizeRental);

export default rentalsRouter;
