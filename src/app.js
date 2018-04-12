// vikas was here!

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

const auth = require('./auth.js');
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

// routes

app.get('/', (req, res) => {
	Strategy.find({}, (err, result) => {
		if (err) {
			res.render('index', { user: res.locals.user });
		}
		
		res.render('index', { user: res.locals.user, strategies: result });
	});
});

app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', (req, res) => {
	const error = (err) => { 
		res.render('register', err);
	};

	const success = (user) => {
		auth.startAuthenticatedSession(req, user, (err) => {
			if (err) {
				res.render('register', err);
			} else {
				res.redirect('/');
			}
		});
	};

	auth.register(req.body.username, req.body.email, req.body.password, error, success);
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.post('/login', (req, res) => {
	const error = (err) => { 
		res.render('login', err);
	};

	const success = (user) => {
		auth.startAuthenticatedSession(req, user, (err) => {
			if (err) {
				res.render('login', err);
			} else {
				res.redirect('/');
			}
		});
	};

	auth.login(req.body.username, req.body.password, error, success);
});

app.get('/strategy/add', (req, res) => {
	if (res.locals.user) {
		res.render('strategy-add', { user: res.locals.user });
	} else {
		res.redirect('/login');
	}
});

app.post('/strategy/add', (req, res) => {
	if (res.locals.user) {
		if (req.body.title) {
			new Strategy({
				title: req.body.title,
				url: req.body.url,
				votes: 0,
				author: res.locals.user._id,
				createdAt: new Date()
			}).save((err, result) => {
				console.log(err, result);
				if (result && !err) {
					res.redirect('/');
				} else {
					res.send('<a href=\'/strategy/add\'>Error saving strategy.');
				}
			});
		} else {
			res.send('<a href=\'/strategy/add\'>Strategy requires title.');
		}
	} else {
		res.redirect('/login');
	}
});

app.get('/strategy/:slug', (req, res) => {
	Strategy.findOne({ slug: req.params.slug }, (err, strategy) => {
		if (!err && strategy) {
			User.findOne({ _id: strategy.author }, (err, user) => {
				if (!err && user) {
					res.render('strategy-detail', { strategy: strategy, author: user});
				} else {
					res.redirect('/');
				}
			});
		} else {
			res.redirect('/');
		}
	});
});

app.get('/user/:username', (req, res) => {
	User.findOne({ username: req.params.username }, (err, user) => {
		if (!err && user) {
			Strategy.find({ author: user._id }, (err, strategies) => {
				if (!err && strategies) {
					res.render('index', { user: res.locals.user, author: req.params.username, strategies: strategies });
				} else {
					res.redirect('/');
				}
			});
		} else {
			res.redirect('/');
		}
	});
});

const server = app.listen(process.env.PORT || 3000);