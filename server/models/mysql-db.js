const mysql = require('mysql');
const passw = require('./db-password.js');
console.log(passw);

const mql = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : passw,
  database : 'socketchat_db'
});

module.exports = mql;