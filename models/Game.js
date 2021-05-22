const mongoose = require('mongoose');
const { Schema } = mongoose;

const GAME_TYPES = require('./gameTypes');

/**
 * GameSchema is a 'base' schema for all games
 *    -> Since all games have some properties in common, and in order to store all of a
 *       user's games in one property, all game types will be discriminators of gameSchema
 */
const GameSchema = new Schema({
   type: {
      type: String,
      enum: GAME_TYPES,
      default: GAME_TYPES.X01,
   },
   dateCreated: {
      type: Date,
      required: true,
   },
});

module.exports = mongoose.model('games', GameSchema);
