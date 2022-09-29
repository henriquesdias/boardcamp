import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connection from "./database/database.js";
dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());

server.get("/test", async (req, res) => {
  try {
    const test = await connection.query("SELECT * FROM categories;");
    res.send(test);
  } catch (error) {
    res.status(400).send(error);
  }
});

server.listen(process.env.PORT, () =>
  console.log(`Listening on port: ${process.env.PORT}`)
);
