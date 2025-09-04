// backend/src/db.ts
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

// conexiune pool la baza MySQL
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  namedPlaceholders: true,
  connectionLimit: 10,
});
