import categoriesRouter from "./routes/categoriesRoutes.js";
import gamesRouter from "./routes/gamesRoutes.js";

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());
server.use(categoriesRouter);
server.use(gamesRouter);

server.listen(process.env.PORT, () =>
  console.log(`Listening on port: ${process.env.PORT}`)
);
