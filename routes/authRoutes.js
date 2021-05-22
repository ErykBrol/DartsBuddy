const router = require('express').Router();

const AuthController = require('../controllers/authController');

/**
 * Auth controller handles all the logic for the auth-related routes
 *
 * POST /auth/login         - sign in using username + password to an existing account
 * GET /auth/logout         - sign out of the currently signed in account
 * GET /auth/current_user   - get some basic info about currently signed in user (if any)
 *
 */
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);
router.get('/current_user', AuthController.currentUser);

module.exports = router;
