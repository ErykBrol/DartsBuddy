const mongoose = require('mongoose');
const { Schema } = mongoose;

const GAME_TYPES = require('./games/gameTypes');

/**
 * GameSchema is a 'base' schema for all game results
 *    -> Since all game results have some properties in common, and in order to store all of a
 *       user's game results in one property, different game types will be discriminators of gameSchema
 */
const gameSchema = new Schema({
   type: {
      type: String,
      enum: GAME_TYPES,
      default: GAME_TYPES.X01,
   },
   roomId: {
      type: String,
      required: true,
   },
   completed: {
      type: Boolean,
      default: false,
   },
   public: {
      type: Boolean,
      default: false,
   },
   p1: {
      type: Schema.Types.ObjectId,
      ref: 'users',
   },
   p2: {
      type: Schema.Types.ObjectId,
      ref: 'users',
   },
}, { timestamps: true });

module.exports = mongoose.model('games', gameSchema);
