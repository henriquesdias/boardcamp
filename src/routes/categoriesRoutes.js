import express from "express";

import {
  getCategories,
  createCategories,
} from "../controllers/categoriesControllers.js";

const categoriesRouter = express.Router();
categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", createCategories);

export default categoriesRouter;
