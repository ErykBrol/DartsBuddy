const router = require('express').Router();

const GameController = require('../controllers/gameController');

/**
 * Game controller handles all the logic for the game-related routes
 *
 * GET /games?type_id       - Get all public games with this id, if type_id is passed, find only games with this type_id
 * GET /games/:game_id      - Get the game with this id
 * POST /games/:type_id     - Create a game of this type (can pass in configuration object, o.w. default setup is used)
 * DEL /games/:game_id      - Delete the game with this id (useful for cancelling a game)
 */
router.get('/', GameController.getGames);
router.get('/:game_id', GameController.getGameById);
router.post('/games/:type_id', GameController.createGame);
router.delete('/:game_id', GameController.deleteGame);

module.exports = router;
