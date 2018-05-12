const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
var router = express.Router();
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
//var scrapper = require('./scrapper');


app.use(cors());
app.use(bodyParser.json());

// // the "index" route, which serves the Angular app
// app.get('/', function (req, res) {
//     res.send('hi');
// });

var index = require('./routes/index');
app.use('/', index);


// catch 404 and forward to error handler
app.use(function (req, res) {
    var err = new Error('File Not Found');
    err.status = 404;
});

// define as the last app.use callback
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.send(err.message);
});


require('./db_connect');
require('passport');

app.use(passport.initialize());


app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"message" : err.name + ": " + err.message});
    } else
        next(err);
});

// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.listen(3000, function () {
    console.log('Listening on port 3000!');
});

module.exports = app;