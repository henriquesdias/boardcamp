import express from "express";

import {
  getCategories,
  createCategories,
} from "../controllers/categoriesControllers.js";
import schemaCategorieValidate from "../middlewares/schemaCategories.js";

const categoriesRouter = express.Router();
categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", schemaCategorieValidate, createCategories);

export default categoriesRouter;
