const mysql = require('mysql2');
require('dotenv').config();

const dbconnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Persistent@211447',
  database: 'employee_db',
});

module.exports = dbconnection;