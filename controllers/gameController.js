const { customAlphabet } = require('nanoid');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 6);

const Game = require('../models/Game');
const X01 = require('../models/X01');
const GAME_TYPES = require('../models/gameTypes');

let GameController = {
   getGames: async (req, res) => {
      // Limit query to 20 results and build it if type_id is provided
      let query = Game.find().limit(20);
      if (req.query.type_id) {
         query.find({ type: req.query.type_id });
      }
      if (req.query.user_id) {
         query.find({ $or: [{ p1: req.query.user_id }, { p2: req.query.user_id }] });
      }

      const games = await query.exec().catch((err) => {
         return res.status(500).send({ msg: 'Error fetching game result', err });
      });

      return res.status(200).send(games);
   },
   getGameById: async (req, res) => {
      const game = await Game.findById(req.params.game_id).catch((err) => {
         return res.status(500).send({ msg: 'Error fetching game result', err });
      });

      return res.send(game);
   },
   createGame: async (req, res) => {
      // Create the roomId and appropriate Game based on the query param
      const roomId = nanoid();
      const game = createGameHelper(req.params.type, req.body.gameConfig);

      if (!game) {
         return res.status(500).send({ msg: 'Error creating game' });
      }
      game.roomId = roomId;
      game.dateCreated = new Date();

      try {
         await game.save();
         // Send the roomId back to the user so they know how to join this game
         return res.status(201).send({ msg: 'Game succesfully created', data: { roomId, id: game._id } });
      } catch (err) {
         return res.status(500).send({ msg: 'Error creating game', err });
      }
   },
   deleteGame: async (req, res) => {
      await Game.findByIdAndDelete(req.params.game_id).catch((err) => {
         return res.status(500).send({ msg: 'Error deleting game result', err });
      });
      return res.status(200).send({ msg: 'Game result successfully deleted' });
   },
};

function createGameHelper(gameType, gameConfig) {
   switch (gameType) {
      case GAME_TYPES.X01:
         return new X01(gameConfig);
      default:
         return null;
   }
}

module.exports = GameController;
