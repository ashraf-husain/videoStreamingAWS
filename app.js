var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv')
var conectDb = require('./db')

var indexRouter = require('./routes');

var app = express();
dotenv.config()
// view engine setup


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
conectDb()

app.use('/video', indexRouter)

app.use('/', (req, res) => {
  return res.status(200).send("Welcome to video streaming...")
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  return res.status(err.status || 500).json({message: err.message})
});

module.exports = app;
