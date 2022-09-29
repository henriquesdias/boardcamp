import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const { Pool } = pg;

// const connection = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });
const connection = new Pool({
  user: "postgres",
  password: process.env.PASSWORD_DATABASE,
  host: "localhost",
  port: 5432,
  database: "boardcamp",
});

export default connection;
