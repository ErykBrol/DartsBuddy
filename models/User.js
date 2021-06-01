const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		minLength: 3,
		maxLength: 20,
	},
	password: {
		type: String,
		required: true,
		minLength: 4,
	},
	nickname: {
		type: String,
		required: false,
		maxLength: 20,
	},
	totalVisits: {
		type: Number,
		default: 0,
	},
	totalScored: {
		type: Number,
		default: 0,
	},
	matchesPlayed: {
		type: Number,
		default: 0,
	},
	wins: {
		type: Number,
		default: 0,
	},
	losses: {
		type: Number,
		default: 0,
	},
}, { timestamps: true });

// Return basic user info summary
UserSchema.virtual('info').get(function () {
	return {
		username: this.username,
		nickname: this.nickname,
		createdAt: this.createdAt,
		id: this._id,
	};
});

// Return user stats
UserSchema.virtual('stats').get(function () {
	return {
		totalVisits: this.totalVisits,
		matchesPlayed: this.matchesPlayed,
		wins: this.wins,
		losses: this.losses,
	};
});

module.exports = mongoose.model('users', UserSchema);
