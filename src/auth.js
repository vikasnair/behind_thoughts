const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');

function register(username, email, password, errorCallback, successCallback) {
	if (username.length < 3 || password.length < 8) {
		console.log('USERNAME PASSWORD TOO SHORT');
		return errorCallback({ message: 'USERNAME PASSWORD TOO SHORT' });
	}

	User.findOne({ username: username }, (err, result) => {
		if (result) {
			console.log('USERNAME ALREADY EXISTS');
			return errorCallback({ message: 'USERNAME ALREADY EXISTS' });
		}

		bcrypt.hash(password, 10, (err, hash) => {
			if (err) {
				console.log('ERROR ENCRYPTING PASSWORD');
				return errorCallback({ message: 'ERROR ENCRYPTING PASSWORD' });
			}

			new User({
				username: username,
				email: email,
				password: hash
			}).save((err, result) => {
				if (err) {
					console.log('DOCUMENT SAVE ERROR');
					return errorCallback({ message: 'DOCUMENT SAVE ERROR' });
				}

				return successCallback(result);
			});
		});
	});
}

function login(username, password, errorCallback, successCallback) {
	User.findOne({ username: username }, (err, result) => {
		if (err || !result) {
			console.log('USER NOT FOUND');
			return errorCallback({ message: 'USER NOT FOUND'});
		}

		bcrypt.compare(password, result.password, (err, match) => {
			if (err) {
				console.log('ERROR COMPARING PASSWORD');
				return errorCallback({ message: 'ERROR COMPARING PASSWORD' });
			}

			if (!match) {
				console.log('PASSWORDS DO NOT MATCH');
				return errorCallback({ message: 'PASSWORDS DO NOT MATCH' });
			}

			return successCallback(result);
		});
	});
}

function startAuthenticatedSession(req, user, cb) {
	req.session.regenerate((err) => {
		if (err) {
			console.log('ERROR REGENERATING SESSION');
			return cb({ message: 'ERROR REGENERATING SESSION' });
		}

		req.session.user = {
			username: user.username,
			_id: user._id
		};

		return cb();
	});
}

module.exports = {
  startAuthenticatedSession: startAuthenticatedSession,
  register: register,
  login: login
};
