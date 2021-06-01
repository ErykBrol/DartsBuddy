const X01Lobby = require('./lobbies/X01Lobby');
const Game = require('../models/Game');
const User = require('../models/User');
const GAME_TYPES = require('../models/games/gameTypes');
const {
   ERROR_ACTION,
   ROOM_JOINED_ACTION,
   START_GAME_ACTION,
   UPDATE_GAME_ACTION,
   GAME_OVER_ACTION,
} = require('./socketActions');

let SocketService = (server) => {
   const io = require('socket.io')(server, {
      cors: {
         origin: 'http://localhost:3000',
         methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      },
   });
   const gameLobbies = {};

   io.on('connection', (socket) => {
      console.log('user #' + socket.id + ' connected');

      socket.on('joinRoom', async (data) => {
         const { roomId, username } = data;

         // Find the Game created with this roomId, only want games with 'complete === false' to avoid collisions
         // with any previous games that might have shared this roomID
         try {
            const game = await Game.findOne({ roomId, completed: false }).exec();
            if (!game) {
               socket.emit(ERROR_ACTION, { msg: 'Unable to find game with this roomId.' });
               return;
            }

            const user = await User.findOne({ username }).exec();
            if (!user) {
               socket.emit(ERROR_ACTION, { msg: 'Unable to find user with this username.' });
               return;
            }

            if (!(roomId in gameLobbies)) {
               gameLobbies[roomId] = createLobby(game);
            }

            lobby = gameLobbies[roomId];

            if (lobby.joinGame(user)) {
               socket.join(roomId);
               io.to(roomId).emit(ROOM_JOINED_ACTION, roomId);
               console.log('Client ' + socket.id + ' joined room with id: ' + roomId);
            } else {
               socket.emit(ERROR_ACTION, { msg: 'Game lobby is full.' });
               return;
            }

            if (lobby.startGame()) {
               io.to(roomId).emit(START_GAME_ACTION, {
                  players: { p1: lobby.p1.username, p2: lobby.p2.username },
                  gameState: lobby.updatePayload(),
               });
            }
         } catch (err) {
            console.error('Unknown error:', err);
            socket.emit(ERROR_ACTION, { msg: 'An unknown error occurred.' });
         }
      });

      socket.on('play', (data) => {
         const { roomId } = data;

         if (!(roomId in gameLobbies)) {
            socket.emit(ERROR_ACTION, { msg: 'Unable to find lobby with this roomId.' });
            return;
         }

         const lobby = gameLobbies[roomId];
         lobby.play(data);

         // Check for any errors as a result of taking a turn
         if (lobby.error) {
            io.to(data.roomId).emit(ERROR_ACTION, lobby.error);
            lobby.error = null;
         }

         // Check to see if the game has ended
         if (lobby.gameState.gameOver) {
            io.to(data.roomId).emit(GAME_OVER_ACTION, lobby.updatePayload());
         } else {
            io.to(data.roomId).emit(UPDATE_GAME_ACTION, lobby.updatePayload());
         }
      });
   });
};

function createLobby(game) {
   switch (game.type) {
      case GAME_TYPES.X01:
         return new X01Lobby(game);
      default:
         return null;
   }
}

module.exports = SocketService;
