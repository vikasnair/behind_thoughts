// vikas was here!

// MARK: Init

const express = require('express');
const app = express();

// MARK: Session

const session = require('express-session');
app.use(session({ cookie: { maxAge: 60000 }, secret: 'secret' }));

// MARK: Debug

const logger = require('morgan');
app.use(logger('dev'));

// MARK: Parsers

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const queryParser = (req, res, next) => {
  const query = {};

  if (req.query.title) {
    query.title = /req.query.title/i;
  }

  req.query = query;
  next();
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(queryParser);

// MARK: Path

const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// MARK: View Engine

app.set('view engine', 'hbs');

// MARK: Database

const mongoose = require('mongoose');
require('./db');
const User = mongoose.model('User');
const Strategy = mongoose.model('Strategy');

// MARK: Authentication

const auth = require('./auth.js');
const passport = auth.passport;
const validateAuth = passport.authenticate('local', { successRedirect: '/',
												failureRedirect: '/login',
												failureFlash: false });
app.use(passport.initialize());
app.use(passport.session());

// MARK: UI

// const favicon = require('serve-favicon');
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// MARK: Routes -- GET

app.get('/', (req, res) => {
	Strategy.find(req.query, (err, result) => {
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

app.get('/login', (req, res) => {
	res.render('login', { message : req.session.error });
});

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

// MARK: Routes -- Post

app.post('/register', (req, res) => {
	const error = (err) => {
		res.render('register', err);
	};

	auth.register(req.body.username, req.body.email, req.body.password, error, validateAuth.bind(null, req, res));
});

app.post('/login', validateAuth);

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

// MARK: Server

app.listen(process.env.PORT || 3000);
