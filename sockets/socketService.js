const X01Lobby = require('./lobbies/X01Lobby');
const Game = require('../models/Game');
const User = require('../models/User');
const GAME_TYPES = require('../models/gameTypes');
const {
   ERROR_ACTION,
   ROOM_JOINED_ACTION,
   START_GAME_ACTION,
   UPDATE_GAME_ACTION,
   GAME_OVER_ACTION,
} = require('./socketActions');

let SocketService = (server, passport, sessionMiddleware) => {
   let rooms = {};
   const io = require('socket.io')(server, {
      cors: {
         origin: 'http://localhost:3000',
         methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      },
   });
   // const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

   // io.use(wrap(sessionMiddleware));
   // io.use(wrap(passport.initialize()));
   // io.use(wrap(passport.session()));

   // io.use((socket, next) => {
   //    console.log(socket.request.user);
   //    next();
   //    // if (socket.request.user) {
   //    //    next();
   //    // } else {
   //    //    next(new Error('unauthorized'));
   //    // }
   // });

   io.on('connection', (socket) => {
      console.log('user #' + socket.id + ' connected');

      // let cookieString = socket.request.headers.cookie;

      // let req = { connection: { encrypted: false }, headers: { cookie: cookieString } };
      // let res = { getHeader: () => {}, setHeader: () => {} };
      // //
      // sessionMiddleware(req, res, () => {
      //    console.log(req.session); // Do something with req.session
      // });

      // const session = socket.request.session;
      // console.log(`saving sid ${socket.id} in session ${session.id}`);
      // session.socketId = socket.id;
      // session.save();

      socket.on('joinRoom', async (data) => {
         const { roomId, username } = data;

         // Find the Game created with this roomId, only want games with 'complete === false' to avoid collisions
         // with any previous games that might have shared this roomID
         const game = await Game.findOne({ roomId, completed: false });
         if (!game) {
            socket.emit(ERROR_ACTION, { msg: 'Error finding game with this roomId' });
         } else {
            const user = await User.findOne({ username });
            if (!user) {
               socket.emit(ERROR_ACTION, { msg: 'Error finding user with this username' });
               return;
            }

            if (!rooms[roomId]) {
               rooms[roomId] = {
                  lobby: createLobby(game),
               };
            }

            const lobby = rooms[roomId].lobby;

            if (lobby.joinGame(user)) {
               socket.join(roomId);
               console.log('Client ' + socket.id + ' joined room with id: ' + roomId);
               io.to(roomId).emit(ROOM_JOINED_ACTION, roomId);
            } else {
               socket.emit(ERROR_ACTION, { msg: 'Error joining game' });
            }
            if (lobby.shouldStart()) {
               io.to(roomId).emit(START_GAME_ACTION, {
                  players: { p1: lobby.p1.username, p2: lobby.p2.username },
                  gameState: lobby.updatePayload(),
               });
            }
         }
      });

      socket.on('play', (data) => {
         const lobby = rooms[data.roomId].lobby;

         if (lobby) {
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
         } else {
            socket.emit(ERROR_ACTION, { msg: "Room doesn't exist" });
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
