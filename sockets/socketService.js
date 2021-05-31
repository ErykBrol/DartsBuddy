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
   const io = require('socket.io')(server, {
      cors: {
         origin: 'http://localhost:3000',
         methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      },
   });

   io.on('connection', (socket) => {
      console.log('user #' + socket.id + ' connected');

      socket.on('joinRoom', async (data) => {
         const { roomId, userId } = data;

         // Find the GameResult entry created with this roomId, only want not complete ones to avoid collisions
         // with previous games that shared this roomID
         const gameResult = await GameResult.findOne({ roomId, completed: false }).catch((err) => {
            console.log("ERROR: couldn't find the game");
            socket.emit(ERROR_ACTION, { msg: 'Error finding game with this roomId' });
         });

         if (!rooms[roomId]) {
            rooms[roomId] = {
               game: createGame(gameResult.type, gameResult.config),
               gameResult,
            };
         }
         const game = rooms[roomId].game;

         if (game.joinGame(userId)) {
            socket.join(roomId);
            console.log('Client ' + socket.id + ' joined room with id: ' + roomId);
            io.to(roomId).emit(ROOM_JOINED_ACTION, roomId);
         } else {
            socket.emit(ERROR_ACTION, { msg: 'Error joining game' });
         }
         if (game.shouldStart()) {
            console.log('starting gmae ---------------------------------------');
            io.to(roomId).emit(START_GAME_ACTION, { players: { p1: game.p1, p2: game.p2 }, gameState: game.gameState });
         }
      });

      socket.on('play', (data) => {
         const game = rooms[data.roomId].game;

         if (game) {
            game.play(data);

            // Check for any errors as a result of taking a turn
            if (game.error) {
               io.to(data.roomId).emit(ERROR_ACTION, game.error);
               game.error = null;
            }

            // Check to see if the game has ended
            if (game.gameState.gameOver) {
               saveGameResult(rooms[data.roomId]);
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

async function saveGameResult(room) {
   let gameResult = room.gameResult;
   let game = room.game;

   // Call the game's saveGame method to save whatever specific the game needs to save
   game.saveGame(gameResult);

   try {
      await gameResult.save();
      return true;
   } catch (err) {
      return false;
   }
}

module.exports = SocketService;
