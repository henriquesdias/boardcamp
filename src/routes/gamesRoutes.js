import express from "express";

import { createGame, getGames } from "../controllers/gamesControllers.js";

const gamesRouter = express.Router();
gamesRouter.post("/games", createGame);
gamesRouter.get("/games", getGames);

export default gamesRouter;
