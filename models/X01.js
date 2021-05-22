const mongoose = require('mongoose');
const { Schema } = mongoose;

const Game = require('../models/Game');

const X01Schema = new Schema({
   p1: {
      type: String,
      required: true,
   },
   p2: {
      type: String,
      required: true,
   },
   startingScore: {
      type: Number,
      default: 501,
   },
   startingPlayer: {
      type: String,
      required: true,
   },
   winner: {
      type: String,
      required: true,
   },
   p1ThreeDartAvg: {
      type: Number,
      required: true,
   },
   p2ThreeDartAvg: {
      type: Number,
      required: true,
   },
   p1FirstNineAvg: {
      type: Number,
      required: true,
   },
   p2FirstNineAvg: {
      type: Number,
      required: true,
   },
});

// Used to set the config for this game easily
X01Schema.virtual('config').set(function (config) {
   this.set({
      p1: config.p1,
      p2: config.p2,
      startingScore: config.startingScore,
      startingScore: config.startingScore,
   });
});

// Used to get an array of game's players easily
X01Schema.virtual('players').get(function () {
   return [this.p1, this.p2];
});

// Used to get this game's stats easily
X01Schema.virtual('stats').get(function () {
   return {
      winner: this.winner,
      p1ThreeDartAvg: this.p1ThreeDartAvg,
      p2ThreeDartAvg: this.p2ThreeDartAvg,
      p1FirstNineAvg: this.p1FirstNineAvg,
      p2FirstNineAvg: this.p2FirstNineAvg,
   };
});

module.exports = Game.discriminator('games', X01Schema);
