var express = require('express');
var router = express.Router();
var connection     = require('../lib/dbconfig');


router.get('/', isAuthenticated,async function(req, res, next) {
  var username   = req.session.user;
});



router.get('/searchUser', isAuthenticated, async function(req,res,next) {
  var user_id = req.session.user.id;
  var sql = 'SELECT * FROM user WHERE locate(?,name)>0';
  var user_name = req.query.user_name;
  user_name = user_name.toLowerCase();
  connection.query(sql, [user_name], function (err, rows) {
    if (err) return err

    res.status(200).send({ "response": rows});
  });
})



router.post('/followUser', isAuthenticated, async function(req,res,next) {
  console.log(req.session.user)
  var user_id = req.session.user.id;
  var sql = 'SELECT * FROM user WHERE username = ?';
  var username = req.body.username;
  connection.query(sql, [username], function (err, rows) {
    if (err) return err
    if(!rows[0]) return res.status(404).send({ "response": "user not found"});
      var sql = 'SELECT * FROM follower where user_id = ? AND follower_id = ?';
      connection.query(sql, [rows[0].id, user_id], function (err, follow) {
        if (err) return err
        if (!follow[0]){
          connection.query('INSERT INTO follower ( user_id, follower_id) values (?,?)', [rows[0].id,user_id], function (err, rows) {
            if (err) return err
        
            res.status(200).send({ "response": rows[0] });
          });
        }else{
           res.status(500).send({ "response": "already done"});
        }
      });
  });
})

router.post('/unFollowUser', isAuthenticated, async function (req, res, next) {
  var user_id = req.session.user.id;
  var sql = 'SELECT * FROM user WHERE username = ?';
  var username = req.body.username;
  connection.query(sql, [username], function (err, rows) {
    if (err) return err
    if(!rows[0]) return res.status(404).send({ "response": "user not found"});
    if(rows[0].id==user_id) return err
    var sql = 'DELETE FROM follower where user_id = ? AND follower_id = ?';
    connection.query(sql, [rows[0].id, user_id], function (err, rows) {
      if (err) return err
  
      res.status(200).send({ "response": rows[0] });
    });
  });
})





router.get('/getProfileInfo', isAuthenticated, async function (req, res, next) {
  var user_id = req.session.user.id;
  var sql = 'SELECT * FROM user WHERE id = ?';
  connection.query(sql, [user_id], function (err, rows) {
    if (err) res.status(500).send({ "response": "error"});
    if(!rows[0]) res.status(404).send({ "response": "user not found"});
    var sql = 'select * FROM follower where user_id = ?';
    connection.query(sql,[user_id], function (err, follower, fields) {
      if (err) return err
      var sql = 'select * FROM follower where follower_id = ?';
      connection.query(sql,[user_id], function (err, following, fields) {
        if (err) return err
        var sql = 'select * FROM likedmovie where user_id = ?'; 
        connection.query(sql,[user_id], function (err, like, fields) {
          if (err) return err
          var sql = 'select * FROM dislikedmovie where user_id = ?'; 
          connection.query(sql,[user_id], function (err, dislike, fields) {
            if (err) return err
            res.status(200).send({"follower": follower.length, "following": following.length,"liked movie":like.length,"dislike movie":dislike.length,"user":rows[0] });
          });
        });
      });
    });
  });
})  


function isAuthenticated(req, res, next) {
  if (req.session.user){

    return next();
  }

}

module.exports = router;
