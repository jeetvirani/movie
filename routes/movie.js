var express = require('express');
var router = express.Router();
var connection = require('../lib/dbconfig');


router.get('/', isAuthenticated, async function(req, res, next) {
    var username = req.session.user;
});

router.get('/genre', isAuthenticated, async function(req, res, next) {
    var user_id = req.session.user.id;
    var sql = 'SELECT * FROM movie WHERE LOWER(genres) = ? ';
    var genres = req.query.genere;
    genres = genres.toLowerCase();
    connection.query(sql, [genres], function(err, rows) {
        if (err) return err

        res.status(200).send({
            "response": rows
        });
    });
})


router.get('/keyword', isAuthenticated, async function(req, res, next) {
    var user_id = req.session.user.id;
    var sql = 'SELECT * FROM movie WHERE locate(?,overview)>0';
    var genres = req.query.text;
    genres = genres.toLowerCase();
    connection.query(sql, [genres], function(err, rows) {
        if (err) return err

        res.status(200).send({
            "response": rows
        });
    });
})

router.get('/region', isAuthenticated, async function(req, res, next) {
    var user_id = req.session.user.id;
    var sql = 'SELECT * FROM movie WHERE locate(?,region)>0';
    var region = req.query.region;
    region = region.toLowerCase();
    connection.query(sql, [region], function(err, rows) {
        if (err) return err

        res.status(200).send({
            "response": rows
        });
    });
})


router.post('/like', isAuthenticated, async function(req, res, next) {
    var user_id = req.session.user.id;
    var sql = 'SELECT * FROM movie WHERE name = ?';
    var movie_name = req.body.movie_name;
    connection.query(sql, [movie_name], function(err, rows) {
        if (err) return err
        if (!rows[0]) return res.status(404).send({
            "response": "movie not found"
        });
        var sql = 'SELECT * FROM likedmovie where movie_id = ? AND user_id = ?';
        connection.query(sql, [rows[0].id, user_id], function(err, bookmark) {
            if (err) return err
            if (!bookmark[0]) {
                connection.query('INSERT INTO likedmovie ( user_id, movie_id) values (?,?)', [user_id, rows[0].id], function(err, like) {
                    if (err) return err;

                    res.status(200).send({
                        "response": like[0]
                    });
                });
            } else {
                res.status(500).send({
                    "response": "already done"
                });
            }
        });
    });
})



router.post('/dislike', isAuthenticated, async function(req, res, next) {
    var user_id = req.session.user.id;
    var sql = 'SELECT * FROM movie WHERE name = ?';
    var movie_name = req.body.movie_name;
    connection.query(sql, [movie_name], function(err, rows) {
        if (err) return res.status(500).send({
            "response": "error"
        });
        if (!rows[0]) return res.status(404).send({
            "response": "movie not found"
        });
        var sql = 'SELECT * FROM likedmovie where movie_id = ? AND user_id = ?';
        connection.query(sql, [rows[0].id, user_id], function(err, bookmark) {
            if (err) return err
            if (!bookmark[0]) {
                connection.query('INSERT INTO dislikedmovie ( user_id, movie_id) values (?,?)', [user_id, rows[0].id], function(err, like) {
                    if (err) return err;

                    res.status(200).send({
                        "response": like[0]
                    });
                });
            } else {
                res.status(500).send({
                    "response": "already done"
                });
            }
        });
    });
})

// router.post('/dislike', isAuthenticated, async function (req, res, next) {
//   var user_id = req.session.user.id
//   var sql = 'SELECT * FROM movie WHERE name = ?';
//   var movie_name = req.body.movie_name;
//   connection.query(sql, [movie_name], function (err, rows) {
//     if (err) return err
//     var sql = 'DELETE FROM likedmovie where user_id = ? AND movie_id = ?';
//     connection.query(sql, [user_id,rows[0].id], function (err, bookmark) {
//       if (err) return err
//       res.status(200).send({ "response": bookmark[0]});
//     });
//   });
// })



function isAuthenticated(req, res, next) {
    if (req.session.user) {

        return next();
    }

}

module.exports = router;