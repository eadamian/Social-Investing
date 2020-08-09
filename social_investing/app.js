var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const firebase = require("firebase");

var config = {
  apiKey: "AIzaSyDvbkoXlfpzAIx8vlXq-KqjvskIpG6zPas",
  authDomain: "productreviews-76b2e.firebaseapp.com",
  databaseURL: "https://productreviews-76b2e.firebaseio.com",
  projectId: "productreviews-76b2e",
  storageBucket: "productreviews-76b2e.appspot.com",
  messagingSenderId: "199054838880"
};
firebase.initializeApp(config);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var portfolioRouter = require('./routes/portfolio');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/portfolio', portfolioRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.sendFile(path.join(__dirname, 'public') + "/404.html");
});

module.exports = app;
