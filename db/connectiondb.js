const mysql = require('mysql2');
require('dotenv').config();

const dbconnection = mysql.createConnection({
  host: process.env.DB_HOST,       // Use process.env to access the variables
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

module.exports = dbconnection;