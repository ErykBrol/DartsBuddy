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

         // Find the GameResult entry created with this roomId
         const gameResult = await GameResult.findOne({ roomId }).catch((err) => {
            console.log("ERROR: couldn't find the game");
            socket.emit(ERROR_ACTION, { msg: 'Error finding game with this roomId' });
         });

         if (gameResult) {
            if (!rooms[roomId]) {
               rooms[roomId] = createGame(gameResult.type, gameResult.config);
            }
            const game = rooms[roomId];

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
         const game = rooms[data.roomId];

         if (game) {
            game.play(data);
            io.to(data.roomId).emit(UPDATE_GAME_ACTION, game.gameState);
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

module.exports = SocketService;
