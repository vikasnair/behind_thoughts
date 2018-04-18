// vikas was here!

// MARK: Modules

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const emailVerify = require('email-verify');

// MARK: Models

const User = mongoose.model('User');

// MARK: Functions

const register = (username, email, password, errorCallback, successCallback) => {
	if (username.length < 3) {
		console.log('USERNAME TOO SHORT.');
		return errorCallback({ message : 'USERNAME NEEDS AT LEAST 3 CHARACTERS.' });
	}

	if (password.length < 8) {
		console.log('PASSWORD TOO SHORT.');
		return errorCallback({ message : 'PASSWORD NEEDS AT LEAST 8 CHARACTERS.' });
	}

	User.findOne({ username: username }, (err, user) => {
		if (err) {
			console.log('ERROR CHECKING USER IN DATABASE.');
			return errorCallback({ message : 'UNKNOWN ERROR. TRY AGAIN.' });
		}

		if (user) {
			console.log('USERNAME ALREADY EXISTS.');
			return errorCallback({ message : 'USERNAME ALREADY EXISTS.' });
		}

		emailVerify.verify(email, (err, result) => {
			if (err) {
				console.log('ERROR CHECKING EMAIL.', err);
				return errorCallback({ message : 'UNKNOWN ERROR. TRY AGAIN.' });
			}

			console.log(result.success);

			if (result.success) {
				bcrypt.hash(password, 10, (err, hash) => {
					if (err) {
						console.log('ERROR ENCRYPTING PASSWORD.', err);
						return errorCallback({ message : 'ERROR ENCRYPTING PASSWORD.' });
					}

					new User({
						username: username,
						email: email,
						password: hash
					}).save((err, newUser) => {
						if (err) {
							console.log('DOCUMENT SAVE ERROR.', err);
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
			console.log('ERROR FINDING USER.', err);
			return cb(err);
		}

		if (!user) {
			console.log('USER NOT FOUND.');
			return cb(null, false, { message : 'INCORRECT USERNAME.' });
		}

		bcrypt.compare(password, user.password, (err, match) => {
			if (err) {
				console.log('ERROR COMPARING PASSWORD.', err);
				return cb(err);
			}

			if (!match) {
				console.log('PASSWORDS DO NOT MATCH.');
				return cb(null, false, { message : 'INCORRECT PASSWORD.' });
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
