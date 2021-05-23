const router = require('express').Router();

const requireLogin = require('../services/requireLogin');
const UserController = require('../controllers/userController');

/**
 * User controller handles all the logic for the user-related routes
 *
 * POST /users/register              - Register for a new account with this username + password
 * GET /users/:user_id               - Get user info of the specified user
 * DEL /users/:user_id               - Delete the specified user
 * PATCH /users/:user_id             - Update profile info of the specified user
 * GET /users/:user_id/stats         - Get the profile statistics of this user
 * GET /users/:user_id/games?recent  - Get a list of game_id's for the games this user has played, takes
 *                                    query param of recent which returns (at most) the last 5 games when true
 */
router.post('/register', UserController.registerUser);
router.get('/:user_id', UserController.getUser);
router.delete('/:user_id', requireLogin, UserController.deleteUser);
router.patch('/:user_id', requireLogin, UserController.updateUser);
router.get('/:user_id/stats', UserController.getStats);
router.get('/:user_id/games', UserController.getGames);

module.exports = router;
