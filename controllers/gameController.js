const { customAlphabet } = require('nanoid');
const { uppercase } = require('nanoid-dictionary');
const nanoid = customAlphabet(uppercase, 6);

const Game = require('../models/Game');
const GAME_TYPES = require('../models/games/gameTypes');
const X01 = require('../models/games/X01');

let GameController = {
   // getGames
   // Params: { ?type_id: string, ?user_id: string(ObjectID),}
   //    type_id<Optional>: Game type to filter results by
   //    user_id<Optional>: User ID to filter results by
   getGames: async (req, res) => {
      const { type_id, user_id } = req.query;

      // Limit query to 20 results and build it if type_id is provided
      let query = Game.find().limit(20);
      if (type_id) {
         query.find({ type: type_id });
      }
      if (user_id) {
         query.find({ $or: [{ p1: user_id }, { p2: user_id }] });
      }

      try {
         const games = await query.exec();
         return res.status(200).send(games);
      } catch (err) {
         console.error(err);
         return res.status(500).send({ msg: 'An unknown error occurred.', err });
      }
   },
   // getGameById
   // Params: { game_id: string }
   //    game_id: ID of the game to retrieve
   getGameById: async (req, res) => {
      const { game_id } = req.params;
      if (!game_id) {
         return res.status(400).send({ msg: 'Missing game_id request parameter' });
      }

      try {
         const game = await Game.findById(game_id);
         if (!game) {
            return res.status(404).send({ msg: 'Game not found' });
         }
         return res.status(200).send(game);
      } catch (err) {
         console.error(err);
         return res.status(500).send({ msg: 'An unknown error occurred.', err });
      }
   },
   // createGame
   // Params: { type_id: string }
   //    type_id: Type of game to create
   // Body: { gameConfig: Object }
   //    gameConfig: Configuration object to initialize game with
   createGame: async (req, res) => {
      const { type } = req.params;
      if (!type) {
         return res.status(400).send({ msg: 'Missing type request parameter' });
      }

      const { gameConfig } = req.body;
      if (!gameConfig) {
         return res.status(400).send({ msg: 'Missing gameConfig on request body' });
      }

      // Create the roomId and appropriate Game based on the query param
      const game = createGameHelper(req.params.type, req.body.gameConfig);

      if (!game) {
         return res.status(400).send({ msg: 'Unsupported game type' });
      }
      game.roomId = nanoid();

      try {
         await game.save();
         // Send the roomId back to the user so they know how to join this game
         return res.status(201).send({ msg: 'Game succesfully created', data: { id: game._id, roomId: game.roomId } });
      } catch (err) {
         console.error(err);
         return res.status(500).send({ msg: 'An unknown error occurred.', err });
      }
   },
   // deleteGame
   // Params: { game_id: string }
   //    game_id: ID of the game to delete
   deleteGame: async (req, res) => {
      const { game_id } = req.params;
      if (!game_id) {
         return res.status(400).send({ msg: 'Missing game_id request parameter' });
      }

      try {
         const game = await Game.findByIdAndDelete(req.params.game_id);
         if (!game) {
            return res.status(404).send({ msg: 'Game not found' });
         }
         return res.status(200).send({ msg: 'Game result successfully deleted' });
      } catch (err) {
         console.error(err);
         return res.status(500).send({ msg: 'An unknown error occurred.', err });
      }
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
