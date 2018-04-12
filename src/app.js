// vikas was here!
// apr 2nd 2018

// modules

const express = require('express');
const session = require('express-session');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('./db');
const User = mongoose.model('User');
const Strategy = mongoose.model('Strategy');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'vikasrox',
    resave: false,
    saveUninitialized: true
}));
app.use((req, res, next) => {
	res.locals.user = req.session.user;
	next();
});

// module.exports = app;

app.set('port', process.env.PORT || 3000)

const server = app.listen(app.get('port'), () => {
  debug('Express server listening on port ' + server.address().port)
});