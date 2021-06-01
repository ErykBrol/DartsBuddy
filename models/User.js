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
   dateJoined: {
      type: Date,
      required: true,
   },
   dartsThrown: {
      type: Number,
      default: 0,
   },
   allTime501Avg: {
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
});

// Used to get basic user info out of Schema easily
UserSchema.virtual('info').get(function () {
   return {
      username: this.username,
      nickname: this.nickname,
      dateJoined: this.dateJoined,
   };
});

// Used to get basic stats out of Schema easily
UserSchema.virtual('stats').get(function () {
   return {
      dartsThrown: this.dartsThrown,
      matchesPlayed: this.matchesPlayed,
      wins: this.wins,
      losses: this.losses,
      allTime501Avg: this.allTime501Avg,
   };
});

module.exports = mongoose.model('users', UserSchema);
