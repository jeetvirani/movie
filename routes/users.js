var express = require('express');
var router = express.Router();
var connection     = require('../lib/dbconfig');


router.get('/', isAuthenticated,async function(req, res, next) {
  var username   = req.session.user;
  console.log(username)                    
});

router.post('/followUser', isAuthenticated, async function(req,res,next) {
  var user_id = req.session.user.id;
  console.log(user_id)
  console.log(req.body)
  var sql = 'SELECT * FROM user WHERE username = ?';
  var username = req.body.username;
  connection.query(sql, [username], function (err, rows) {
    if (err) return err;
    console.log(rows[0])
    var sql = 'SELECT * FROM follower where user_id = ? AND follower_id = ?';
    connection.query(sql, [rows[0].id, user_id], function (err, follow) {
      if (err) return err;
      if (!follow[0]){
        connection.query('INSERT INTO follower ( user_id, follower_id) values (?,?)', [rows[0].id,user_id], function (err, rows) {
          if (err) return err;
          console.log("successfully followed ")
          res.status(200).send({ "response": rows[0] });
        });
      }
    });
  });
})

router.post('/unFollowUser', isAuthenticated, async function (req, res, next) {
  var user_id = req.session.user.id;
  console.log(user_id)
  console.log(req.body)
  var sql = 'SELECT * FROM user WHERE username = ?';
  var username = req.body.username;
  connection.query(sql, [username], function (err, rows) {
    if (err) return err;
    console.log(rows[0])
    var sql = 'DELETE FROM follower where user_id = ? AND follower_id = ?';
    connection.query(sql, [rows[0].id, user_id], function (err, rows) {
      if (err) return err;
      console.log("successfully unfollowed ")
      res.status(200).send({ "response": rows[0] });
    });
  });
})


function isAuthenticated(req, res, next) {
  if (req.session.user){
    console.log(req.session.user)
    return next();
  }

  console.log("error")
}

module.exports = router;
