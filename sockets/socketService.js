const X01Game = require('./games/X01Game');
const GameResult = require('../models/GameResult');
const GAME_TYPES = require('../models/gameTypes');
const {
   ERROR_ACTION,
   ROOM_JOINED_ACTION,
   START_GAME_ACTION,
   UPDATE_GAME_ACTION,
   GAME_OVER_ACTION,
} = require('./socketActions');

let SocketService = (server) => {
   let rooms = {};
   const io = require('socket.io')(server);

   io.on('connection', (socket) => {
      console.log('user #' + socket.id + ' connected');

      socket.on('joinRoom', async (data) => {
         const roomId = data.roomId;
         const userId = data.userId;

         // Find the GameResult entry created with this roomId, only want not complete ones to avoid collisions
         // with previous games that shared this roomID
         const gameResult = await GameResult.findOne({ roomId, completed: false }).catch((err) => {
            console.log("ERROR: couldn't find the game");
            socket.emit(ERROR_ACTION, { msg: 'Error finding game with this roomId' });
         });

         if (gameResult) {
            if (!rooms[roomId]) {
               rooms[roomId] = {
                  game: createGame(gameResult.type, gameResult.config),
                  gameResult,
               };
            }
            const game = rooms[roomId].game;

            socket.join(roomId);
            if (game.joinGame(userId)) {
               console.log('Client ' + socket.id + ' joined room with id: ' + roomId);
               io.to(roomId).emit(ROOM_JOINED_ACTION, roomId);
            } else {
               socket.emit(ERROR_ACTION, { msg: 'Error joining game' });
            }
            if (game.shouldStart()) {
               io.to(roomId).emit(START_GAME_ACTION, game.turn);
            }
         } else {
            socket.emit(ERROR_ACTION, { msg: "Room doesn't exist" });
         }
      });

      socket.on('play', (data) => {
         const game = rooms[data.roomId].game;

         if (game) {
            game.play(data);
            if (game.gameState.gameOver) {
               saveGame(rooms[data.roomId]);
               io.to(data.roomId).emit(GAME_OVER_ACTION, game.gameState);
            } else {
               io.to(data.roomId).emit(UPDATE_GAME_ACTION, game.gameState);
            }
         } else {
            socket.emit(ERROR_ACTION, { msg: "Room doesn't exist" });
         }
      });
   });
};

function createGame(gameType, gameConfig) {
   switch (gameType) {
      case GAME_TYPES.X01:
         return new X01Game(gameConfig);
      default:
         return null;
   }
}

async function saveGame(room) {
   let gameResult = room.gameResult;
   let game = room.game;

   gameResult.completed = true;
   gameResult.p1 = game.p1;
   gameResult.p2 = game.p2;
   gameResult.winner = game.gameState.matchWinner;
   gameResult.legWinners = game.gameState.legWinners;
   gameResult.stats = game.stats;

   try {
      await gameResult.save();
      return true;
   } catch (err) {
      return false;
   }
}

module.exports = SocketService;
