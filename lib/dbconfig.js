var mysql        = require('mysql');
var connection   = mysql.createConnection({
  supportBigNumbers: true,
  bigNumberStrings: true,
  host: 'us-cdbr-east-04.cleardb.com',
  user: 'b6d6c6e8740d20',
  password: 'b3f75ada',
  database: 'heroku_1daa39da0375291'
  // host     : "localhost",
  // user     : "root",
  // password : "",
  // database : "movie_development"
});

module.exports = connection;
