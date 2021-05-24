const { nanoid } = require('nanoid');

const Room = require('./Room');

let roomManager = (server) => {
   let rooms = {};
   const io = require('socket.io')(server);

   io.on('connection', (socket) => {
      console.log('user #' + socket.id + ' connected');

      socket.on('createRoom', (gameConfig) => {
         // use nanoID to generate ID of length 8 -> chances of collision
         // are minimal even at 1k reqs/minute for 100 days
         // TODO: tweak the id to only be alphanumeric, no hyphens/underscores
         const roomId = nanoid(8);
         const room = new Room(gameConfig, roomId, io);
         rooms[roomId] = room;
         console.log('Create room with id: ' + roomId);
      });

      socket.on('joinRoom', (data) => {
         const roomId = data.roomId;
         const userId = data.userId;
         const room = rooms[roomId];
         if (room) {
            socket.join(roomId);
            room.joinRoom(roomId, userId);
            console.log('Client ' + socket.id + ' joined room with id: ' + roomId);
            socket.emit('roomJoined', roomId);
         } else {
            socket.emit('err', { msg: "Room doesn't exist" });
         }
      });

      socket.on('leaveRoom', (roomId) => {
         socket.leave(roomId);
         delete rooms[socket.id];
      });

      socket.on('play', (data) => {
         const room = rooms[data.roomId];
         if (room) {
            room.play(data);
         } else {
            socket.emit('err', { msg: "Room doesn't exist" });
         }
      });
   });
};

module.exports = roomManager;
