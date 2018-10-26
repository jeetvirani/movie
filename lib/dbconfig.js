var mysql        = require('mysql');
var connection   = mysql.createConnection({
  supportBigNumbers: true,
  bigNumberStrings: true,
  host: 'sql12.freemysqlhosting.net',
  user: 'sql12262904',
  password: 'T2A8rf4tID',
  database: 'sql12262904'
  // host     : "localhost",
  // user     : "root",
  // password : "",
  // database : "movie_development"
});

module.exports = connection;
