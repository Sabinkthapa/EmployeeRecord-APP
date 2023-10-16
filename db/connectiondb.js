const mysql = require ('mysql')

const connection =mysql.createConnection({
    host:"localhost",
    user:"root",
    password: "Persistent@211447",
    database: 'employee_db',
});

connection.connect((err)=>{
    if(err) throw err;
    console.log('Connected to database');
});

module.exports = connection;