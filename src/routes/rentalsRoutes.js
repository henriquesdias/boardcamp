import express from "express";

import { createRental } from "../controllers/rentalsControllers.js";

const rentalsRouter = express.Router();
rentalsRouter.post("/rentals", createRental);

export default rentalsRouter;
