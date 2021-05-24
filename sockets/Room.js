const GAME_TYPES = require('../models/gameTypes');
const X01Manager = require('./gameManagers/X01Manager');

module.exports = class Room {
   constructor(gameConfig, roomId, io) {
      this.gameManager = null;
      this.roomId = roomId;
      this.io = io;
      this.gameConfig = gameConfig;

      switch (this.gameConfig.gameType) {
         case GAME_TYPES.X01:
            this.gameManager = new X01Manager(gameConfig);
            break;
         default:
            console.log('Error: Bad game type');
      }
   }

   joinRoom(roomId, userId) {
      if (this.gameManager.joinGame(userId)) {
         this.io.to(roomId).emit('roomJoined', roomId);
      } else {
         console.log("Error: Couldn't join room");
      }
      this.startGame(roomId);
   }

   startGame(roomId) {
      if (this.gameManager.shouldStart()) {
         // Emit event for starting
         this.io.to(roomId).emit('gameOn', this.gameManager.turn);
      }
   }

   // TODO: implement this and have it called if gameManager reports game over
   endGame() {
      // Call save game function
      // Emit event for game over with result
   }

   // TODO: add a check per call to play() for if game is over
   // and then handle that appropriately
   play(data) {
      const sendToClient = this.gameManager.play(data);
      this.io.to(data.roomId).emit('update', sendToClient);
   }

   // TODO: add a method to check if game is over -> each gameManager is expected to have one
};
