// vikas was here!

// MARK: Modules

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const emailExistence = require('email-existence');

// MARK: Models

const User = mongoose.model('User');

// MARK: Functions

const register = (username, email, password, errorCallback, successCallback) => {
	if (username.length < 3 || password.length < 8) {
		console.log('USERNAME OR PASSWORD TOO SHORT');
		return errorCallback({ message : 'USERNAME PASSWORD TOO SHORT' });
	}

	User.findOne({ username: username }, (err, user) => {
		if (err) {
			console.log('ERROR CHECKING USER IN DATABASE.');
			return errorCallback({ message : 'UNKNOWN ERROR. TRY AGAIN.' });
		}

		if (user) {
			console.log('USERNAME ALREADY EXISTS');
			return errorCallback({ message : 'USERNAME ALREADY EXISTS.' });
		}

		emailExistence.check(email, (err, result) => {
			if (err) {
				console.log('ERROR CHECKING EMAIL.');
				return errorCallback({ message : 'UNKNOWN ERROR. TRY AGAIN.' });
			}

			if (result) {
				bcrypt.hash(password, 10, (err, hash) => {
					if (err) {
						console.log('ERROR ENCRYPTING PASSWORD');
						return errorCallback({ message : 'ERROR ENCRYPTING PASSWORD.' });
					}

					new User({
						username: username,
						email: email,
						password: hash
					}).save((err, newUser) => {
						if (err) {
							console.log('DOCUMENT SAVE ERROR.');
							return errorCallback({ message : 'ERROR REGISTERING USER. TRY AGAIN.' });
						}

						return successCallback(newUser.username, newUser.password);
					});
				});
			} else {
				console.log('EMAIL NOT VALID.');
				return errorCallback({ message : 'EMAIL NOT VALID.' });
			}
		});
	});
};

const login = (username, password, cb) => {
	User.findOne({ username : username }, (err, user) => {
		if (err) {
			console.log('ERROR FINDING USER');
			return cb(err);
		}

		if (!user) {
			console.log('USER NOT FOUND');
			return cb(null, false, { message : 'Incorrect username.' });
		}

		bcrypt.compare(password, user.password, (err, match) => {
			if (err) {
				console.log('ERROR COMPARING PASSWORD');
				return cb(err);
			}

			if (!match) {
				console.log('PASSWORDS DO NOT MATCH');
				return cb(null, false, { message : 'Incorrect password.' });
			}

			return cb(null, user);
		});
	});
};

passport.use(new LocalStrategy(login));
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = {
  register: register,
  passport: passport
};
