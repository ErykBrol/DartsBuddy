module.exports = class X01Game {
   constructor(gameConfig) {
      // TODO: potentially refactor the way players/scores are stored
      // to make accessing and modifying them easier
      this.p1 = null;
      this.p2 = null;
      this.gameState = {
         p1Score: gameConfig.startingScore,
         p2Score: gameConfig.startingScore,
      };
      // this.numLegs = gameConfig.numLegs;
      // this.numSets = gameConfig.numSets;
      this.turn = null;
   }

   /**
    * Determine if we can start the game
    *
    * @returns true if 2 players are in the room, false otherwise
    */
   shouldStart() {
      if (this.p1 && this.p2) {
         this.turn = this.p1;
         console.log("Game on! It's " + this.turn + "'s turn");
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
      console.log(this.gameState);
      console.log(this.gameState.p1Score);

      this._scoreVisit(score, this.gameState.p1Score);

      if (this._isGameOver()) {
         let winner = null;
         if (this.gameState.p1Score === 0) {
            winner = this.p1;
         } else {
            winner = this.p2;
         }
         console.log('Game Over!');
         console.log('The winner is ' + winner);
      } else {
         this._swapTurns();
         console.log("It's now " + this.turn + "'s turn");
      }
   }

   // if the game is over -> if so, then emit game over to socket and do other db stuff to save game
   _isGameOver() {
      if (this.gameState.p1Score === 0 || this.gameState.p2Score === 0) {
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
            let remaining = this.gameState.p1Score - score;

            // Only update the score if they didn't bust
            if (remaining >= 0) {
               this.gameState.p1Score = remaining;
               console.log('Player ' + this.turn + ' scored ' + score);
            } else {
               console.log('Player ' + this.turn + ' busted!');
            }
         } else {
            let remaining = this.gameState.p2Score - score;

            // Only update the score if they didn't bust
            if (remaining >= 0) {
               this.gameState.p2Score = remaining;
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
