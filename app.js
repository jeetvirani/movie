var express = require('express');
var path = require('path');
var logger = require('morgan');
const multer = require('multer');
var cookieParser = require('cookie-parser');
const crypto = require('crypto-browserify');
var bodyParser = require('body-parser');
var index = require('./routes/index');
const mime = require("mime");
var users = require('./routes/users');
var movie = require('./routes/movie');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
        });
    }
});
var upload = multer({
    storage: storage
});



var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




var connection = require('./lib/dbconfig');

var sess = require('express-session');
var Store = require('express-session').Store

app.use(sess({
    name: 'JEETSESSION',
    secret: 'MYSECRETJEETSECRET',
    resave: true,
    saveUninitialized: true
}));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'uploads')));


app.use('/', index);
app.use('/users', users);
app.use('/movies', movie);


app.get('/login', function(req, res) {
    res.render('login');
});


connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


app.post("/login", function(req, res) {
    var sql = 'SELECT * FROM user WHERE username = ? AND password = ?';
    var username = req.body.username;
    var password = req.body.password;
    connection.query(sql, [username, password], function(err, rows) {
        console.log("ere", err);
        if (err) return err;

        console.log(rows[0])
        req.session.user = rows[0];
        res.status(200).send({
            "response": rows[0]
        });
    });
});

app.get('/register', function(req, res) {
    res.render('register');
});

app.post("/register", upload.single('image_url'), function(req, res) {
    var username = req.body.username;
    var name = req.body.name;
    var password = req.body.password;
    var image_url = req.file.filename;
    var sql = 'SELECT * FROM user WHERE username = ? AND password = ?';
    connection.query(sql, [username, password], function(err, rows) {
        console.log("ere", err);
        if (err) return err;
        if (!rows[0]) {
            connection.query('INSERT INTO user ( username, password, name, image_url ) values (?,?,?,?)', [username, password, name, image_url], function(err, rows) {
                console.log(err);
                if (err) return err;
                userdata = {
                    id: rows.insertId,
                    username: username,
                    password: password
                };
                console.log(userdata)
                req.session.user = userdata;
                res.status(200).send({
                    "response": userdata
                });
            });
        }
    });
});


app.get('/logout', function(req, res) {
    req.session.destroy();
    req.logout();
    res.redirect('/login');
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;