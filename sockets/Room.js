const GAME_TYPES = require('../models/gameTypes');
const X01Manager = require('./gameManagers/X01Manager');

module.exports = class Room {
   constructor(gameConfig, roomId, io) {
      this.gameManager = null;
      this.roomId = roomId;
      this.io = io;
      this.gameConfig = gameConfig;
      this.gameState = {};

      console.log(gameConfig);

      switch (this.gameConfig.gameType) {
         case GAME_TYPES.X01:
            this.gameManager = new X01Manager(gameConfig);
            break;
         default:
            console.log('BAD GAME TYPE');
      }
   }

   joinRoom(roomId) {
      // Do shit with userData
      this.io.to(roomId).emit('roomJoined', roomId);
   }

   startGame() {
      if (this.gameManager.shouldStart()) {
         // Emit event for starting
      }
   }

   endGame() {
      // Call save game function
      // Emit event for game over with result
   }

   play(turnData) {
      this.gameManager.play(this.gameState, turnData);
   }
};
