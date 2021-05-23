const router = require('express').Router();

const requireLogin = require('../services/requireLogin');
const GameController = require('../controllers/gameController');

/**
 * Game controller handles all the logic for the game-related routes which are
 * responsible for game documents on the db
 *
 * GET /games?type_id       - Get all games, if type_id is passed, find only games with this type_id
 * GET /games/:game_id      - Get the game with this id
 * POST /games/:type_id     - Create a game of this type, must pass in type of game and date created
 * DEL /games/:game_id      - Delete the game with this id (useful for cancelling a game)
 */
router.get('/', GameController.getGames);
router.get('/:game_id', GameController.getGameById);
router.post('/games/:type_id', requireLogin, GameController.createGame);
router.delete('/:game_id', requireLogin, GameController.deleteGame);

module.exports = router;
