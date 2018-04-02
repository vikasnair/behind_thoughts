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

	author: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},

	createdAt: {
		type: Date,
		required: true
	}
});

StrategySchema.plugin(URLSlugs("title"));
mongoose.model('User', UserSchema);
mongoose.model('Strategy', StrategySchema);
mongoose.connect('mongodb://localhost/hw06');