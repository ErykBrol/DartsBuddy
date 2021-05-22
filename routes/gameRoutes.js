const router = require('express').Router();
const GameController = require('../controllers/gameController');

router.post('/create/X01', GameController.createX01);

module.exports = router;
