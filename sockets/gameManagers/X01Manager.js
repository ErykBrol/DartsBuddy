module.exports = class Room {
   constructor(gameConfig) {
      // TODO: potentially refactor the way players/scores are stored
      // to make accessing and modifying them easier
      this.p1 = null; // username
      this.p2 = null;
      this.p1Score = gameConfig.startingScore;
      this.p2Score = gameConfig.startingScore;
      this.numLegs = gameConfig.numLegs;
      this.numSets = gameConfig.numSets;
      this.turn = null; // username
   }

   /**
    * Determine if we can start the game
    *
    * @returns true if 2 players are in the room, false otherwise
    */
   shouldStart() {
      if (this.p1 && this.p2) {
         this.turn = this.p1;
         console.log("Game on! It's " + this.turn + " 's turn");
         return true;
      }
      return false;
   }

   /**
    * Add this player to the game if possible
    *
    * @param player userId of the player that's joining
    * @returns true on success, false on failure
    */
   joinGame(player) {
      if (!this.p1) {
         this.p1 = player;
         return true;
      } else if (!this.p2) {
         this.p2 = player;
         return true;
      } else {
         return false;
      }
   }

   /**
    * Process a turn being taken
    *
    * @param data object containing info about the player/move that was made
    * @param gameState object containing the state of the game before the move was made
    * @returns gameState updated after the move has been processed
    */
   play(data) {
      const score = data.score;

      this._scoreVisit(score, this.p1Score);

      // TODO: move this game over stuff like mentioned in comment on the function
      if (this._isGameOver()) {
         let winner = null;
         if (this.p1Score === 0) {
            winner = this.p1;
         } else {
            winner = this.p2;
         }
         console.log('Game Over!');
         console.log('The winner is ' + winner);
      } else {
         this._swapTurns();
         let gameState = {
            p1Score: this.p1Score,
            p2Score: this.p2Score,
         };
         console.log("It's now " + this.turn + "'s turn");
         return gameState;
      }
   }

   // TODO: this should probably be a Room function, every time we play check to see
   // if the game is over -> if so, then emit game over to socket and do other db stuff to save game
   _isGameOver() {
      if (this.p1Score === 0 || this.p2Score === 0) {
         return true;
      }
      return false;
   }

   // TODO: refactor this function to be less repetitive
   _scoreVisit(score) {
      if (score > 180 || score < 0) {
         // error
      } else {
         if (this.turn == this.p1) {
            let remaining = this.p1Score - score;

            // Only update the score if they didn't bust
            if (remaining >= 0) {
               this.p1Score = remaining;
               console.log('Player ' + this.turn + ' scored ' + score);
            } else {
               console.log('Player ' + this.turn + ' busted!');
            }
         } else {
            let remaining = this.p2Score - score;

            // Only update the score if they didn't bust
            if (remaining >= 0) {
               this.p2Score = remaining;
               console.log('Player ' + this.turn + ' scored ' + score);
            } else {
               console.log('Player ' + this.turn + ' busted!');
            }
         }
      }
   }

   _swapTurns() {
      if (this.turn == this.p1) {
         this.turn = this.p2;
      } else {
         this.turn = this.p1;
      }
   }
};
