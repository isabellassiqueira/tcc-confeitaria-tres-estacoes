// Backend_Cliente/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '1234',
  database: process.env.DB_NAME || 'confeitaria_system',
  port: Number(process.env.DB_PORT || 3306), // <<<<<< porta do MySQL/MariaDB
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log(
  `[DB] Conectando em ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}/` +
  `${process.env.DB_NAME || 'confeitaria_system'} como ${process.env.DB_USER || 'root'}`
);

module.exports = pool;
