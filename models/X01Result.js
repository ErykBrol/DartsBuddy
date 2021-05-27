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
   startingPlayer: {
      type: String,
      required: true,
   },
   winner: {
      type: String,
   },
   p1ThreeDartAvg: {
      type: Number,
   },
   p2ThreeDartAvg: {
      type: Number,
   },
   p1FirstNineAvg: {
      type: Number,
   },
   p2FirstNineAvg: {
      type: Number,
   },
});

// Used to get the config for this game easily
X01ResultSchema.virtual('config').get(function () {
   return {
      startingScore: this.startingScore,
      startingPlayer: this.startingPlayer,
   };
});

// Used to get an array of game's players easily
X01ResultSchema.virtual('players').get(function () {
   return [this.p1, this.p2];
});

// Used to get this game's stats easily
X01ResultSchema.virtual('stats').get(function () {
   return {
      winner: this.winner,
      p1ThreeDartAvg: this.p1ThreeDartAvg,
      p2ThreeDartAvg: this.p2ThreeDartAvg,
      p1FirstNineAvg: this.p1FirstNineAvg,
      p2FirstNineAvg: this.p2FirstNineAvg,
   };
});

module.exports = GameResult.discriminator('X01Results', X01ResultSchema);
