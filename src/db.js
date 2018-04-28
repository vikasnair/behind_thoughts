const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		lowercase: true,
		trim: true,
		minlength: 3
	},

	email: {
		type: String,
		unique: true,
		required: true
	},

	password: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		minlength: 8
	}
});

const StrategySchema = new mongoose.Schema({
	title: {
		type: String,
		unique: true,
		required: true
	},

	votes: {
		type: Number
	},

	voters: {
		type: [String],
		required: false
	},

	authorID: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},

	authorUsername: {
		type: String,
		reuired: true
	},

	createdAt: {
		type: String,
		required: true
	}
});

StrategySchema.plugin(URLSlugs("title"));
mongoose.model('User', UserSchema);
mongoose.model('Strategy', StrategySchema);
mongoose.connect('mongodb://admin:root@ds143099.mlab.com:43099/heroku_g27x0hb2'); // TODO: make this an ENV variable

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
 console.log('we good');
});
