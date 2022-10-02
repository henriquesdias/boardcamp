import express from "express";

import { createGame, getGames } from "../controllers/gamesControllers.js";
import schemaGameValidate from "../middlewares/schemaGames.js";

const gamesRouter = express.Router();
gamesRouter.post("/games", schemaGameValidate, createGame);
gamesRouter.get("/games", getGames);

export default gamesRouter;
