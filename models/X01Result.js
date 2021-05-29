const mongoose = require('mongoose');
const { Schema } = mongoose;

const GameResult = require('./GameResult');

const X01ResultSchema = new Schema({
   p1: {
      type: String,
   },
   p2: {
      type: String,
   },
   startingScore: {
      type: Number,
      required: true,
   },
   numLegsToWin: {
      type: Number,
      required: true,
   },
   winner: {
      type: String,
   },
   p1Visits: {
      type: Number,
   },
   p2Visits: {
      type: Number,
   },
   p1ThreeDartAvg: {
      type: Number,
   },
   p2ThreeDartAvg: {
      type: Number,
   },
   p1TotalScored: {
      type: Number,
   },
   p2TotalScored: {
      type: Number,
   },
   p1DartsThrown: {
      type: Number,
   },
   p2DartsThrown: {
      type: Number,
   },
});

// Used to get the config for this game easily
X01ResultSchema.virtual('config').get(function () {
   return {
      startingScore: this.startingScore,
      numLegsToWin: this.numLegsToWin,
   };
});

// Used to get an array of game's players easily
X01ResultSchema.virtual('players').get(function () {
   return [this.p1, this.p2];
});

// Used to get this game's stats easily
X01ResultSchema.virtual('stats').get(function () {
   return {
      p1ThreeDartAvg: this.p1ThreeDartAvg,
      p2ThreeDartAvg: this.p2ThreeDartAvg,
      p1TotalScored: this.p1TotalScored,
      p2TotalScored: this.p2TotalScored,
      p1DartsThrown: this.p1DartsThrown,
      p2DartsThrown: this.p2DartsThrown,
   };
});

// Used to set this game's stats easily
X01ResultSchema.virtual('stats').set(function (stats) {
   this.p1ThreeDartAvg = stats.p1ThreeDartAvg;
   this.p2ThreeDartAvg = stats.p2ThreeDartAvg;
   this.p1TotalScored = stats.p1TotalScored;
   this.p2TotalScored = stats.p2TotalScored;
   this.p1DartsThrown = stats.p1DartsThrown;
   this.p2DartsThrown = stats.p2DartsThrown;
});

module.exports = GameResult.discriminator('X01Results', X01ResultSchema);
