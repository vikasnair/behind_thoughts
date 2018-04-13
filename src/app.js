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
const passport = auth.passport;
const validate = passport.authenticate('local', { successRedirect: '/',
												failureRedirect: '/login',
												failureFlash: false });
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
app.use(session({ cookie: { maxAge: 60000 }, secret: 'secret' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

// routes

app.get('/', (req, res) => {
	Strategy.find({}, (err, result) => {
		if (err) {
			res.render('index', { user: req.user });
		} else {
			res.render('index', { user: req.user, strategies: result });
		}
	});
});

app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', (req, res) => {
	const error = (err) => { 
		res.render('register', err);
	};

	auth.register(req.body.username, req.body.email, req.body.password, error, validate.bind(null, req, res));
});

app.get('/login', (req, res) => {
	res.render('login', { message : req.session.error });
});

app.post('/login', validate);

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

app.get('/strategy/add', (req, res) => {
	if (req.user) {
		res.render('strategy-add', { user: req.user });
	} else {
		res.redirect('/login');
	}
});

app.post('/strategy/add', (req, res) => {
	if (req.user) {
		if (req.body.title) {
			new Strategy({
				title: req.body.title,
				url: req.body.url,
				votes: 0,
				author: req.user._id,
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
					res.render('index', { user: req.user, author: req.params.username, strategies: strategies });
				} else {
					res.redirect('/');
				}
			});
		} else {
			res.redirect('/');
		}
	});
});

app.listen(process.env.PORT || 3000);