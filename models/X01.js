const mongoose = require('mongoose');
const { Schema } = mongoose;

const Game = require('./Game');

const X01Schema = new Schema({
   startingScore: {
      type: Number,
      required: true,
   },
   numLegsToWin: {
      type: Number,
      required: true,
   },
   winner: {
      type: Schema.Types.ObjectId,
      ref: 'users',
   },
   p1Visits: {
      type: Number,
   },
   p2Visits: {
      type: Number,
   },
   p1VisitAvg: {
      type: Number,
   },
   p2VisitAvg: {
      type: Number,
   },
   p1TotalScored: {
      type: Number,
   },
   p2TotalScored: {
      type: Number,
   },
});

// Used to get the config for this game easily
X01Schema.virtual('config').get(function () {
   return {
      startingScore: this.startingScore,
      numLegsToWin: this.numLegsToWin,
   };
});

// Used to get an array of game's players easily
X01Schema.virtual('players').get(function () {
   return [this.p1, this.p2];
});

// Used to get this game's stats easily
X01Schema.virtual('stats').get(function () {
   return {
      p1VisitAvg: this.p1VisitAvg,
      p2VisitAvg: this.p2VisitAvg,
      p1TotalScored: this.p1TotalScored,
      p2TotalScored: this.p2TotalScored,
   };
});

// Used to set this game's stats easily
X01Schema.virtual('stats').set(function (stats) {
   this.p1VisitAvg = stats.p1VisitAvg;
   this.p2VisitAvg = stats.p2VisitAvg;
   this.p1TotalScored = stats.p1TotalScored;
   this.p2TotalScored = stats.p2TotalScored;
});

module.exports = Game.discriminator('X01', X01Schema);
