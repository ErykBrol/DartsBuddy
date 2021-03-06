const router = require('express').Router();

const requireLogin = require('../services/requireLogin');
const GameController = require('../controllers/gameController');

/**
 * Game controller handles all the logic for the game-related routes which are
 * responsible for game documents on the db
 *
 * GET /games?type_id=X01&?user_id=123      - Get public games (limited to at most 20 per query), if type_id is passed
 *                                            find only games with this type_id
 * GET /games/:game_id                      - Get the game with this id
 * POST /games/:type                        - Create a game of this type, requires a gameConfig object to init the game with
 * DEL /games/:game_id                      - Delete the game with this id
 */
router.get('/', GameController.getGames);
router.get('/:game_id', GameController.getGameById);
router.post('/:type', GameController.createGame);
router.delete('/:game_id', requireLogin, GameController.deleteGame);

module.exports = router;
