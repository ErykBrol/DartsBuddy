const { customAlphabet } = require('nanoid');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 6);

const X01Result = require('../models/X01Result');
const GAME_TYPES = require('../models/gameTypes');

let GameController = {
   getGames: (req, res) => {},
   getGameById: (req, res) => {},
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
   deleteGame: (req, res) => {},
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
