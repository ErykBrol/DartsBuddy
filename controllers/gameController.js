const { customAlphabet } = require('nanoid');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 6);

const GameResult = require('../models/GameResult');
const X01Result = require('../models/X01Result');
const GAME_TYPES = require('../models/gameTypes');

let GameController = {
   getGames: async (req, res) => {
      // Limit query to 20 results and build it if type_id is provided
      let query = GameResult.find().limit(20);
      if (req.query.type_id) {
         query.find({ type: req.query.type_id });
      }

      const gameResults = await query.exec().catch((err) => {
         return res.status(500).send({ msg: 'Error fetching game result', err });
      });

      return res.status(200).send(gameResults);
   },
   getGameById: async (req, res) => {
      const gameResult = await GameResult.findById(req.params.game_id).catch((err) => {
         return res.status(500).send({ msg: 'Error fetching game result', err });
      });

      return res.send(gameResult);
   },
   createGame: async (req, res) => {
      // Create the roomId and appropriate Game based on the query param
      const roomId = nanoid();
      const gameResult = createGameResult(req.params.type, req.body.gameConfig);

      if (!gameResult) {
         return res.status(500).send({ msg: 'Error creating game' });
      }
      gameResult.roomId = roomId;
      gameResult.dateCreated = new Date();

      try {
         await gameResult.save();
         // Send the roomId back to the user so they know how to join this game
         return res.status(201).send({ msg: 'Game succesfully created', data: { roomId } });
      } catch (err) {
         return res.status(500).send({ msg: 'Error creating game', err });
      }
   },
   deleteGame: async (req, res) => {
      await GameResult.findByIdAndDelete(req.params.game_id).catch((err) => {
         return res.status(500).send({ msg: 'Error deleting game result', err });
      });
      return res.status(200).send({ msg: 'Game result successfully deleted' });
   },
};

function createGameResult(gameType, gameConfig) {
   switch (gameType) {
      case GAME_TYPES.X01:
         return new X01Result(gameConfig);
      default:
         return null;
   }
}

module.exports = GameController;
