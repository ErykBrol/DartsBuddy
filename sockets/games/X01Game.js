module.exports = class X01Game {
   constructor(gameConfig) {
      this.p1 = null;
      this.p2 = null;
      this.gameState = {
         p1Score: gameConfig.startingScore,
         p2Score: gameConfig.startingScore,
         gameOver: false,
         matchWinner: null, // Winner of the match
         turn: null,
         currentLeg: 1,
         legWinners: [], // Array storing playerID of each leg
      };
      this.stats = {
         p1TotalScored: 0,
         p2TotalScored: 0,
         p1DartsThrown: 0,
         p2DartsThrown: 0,
         p1ThreeDartAvg: 0,
         p2ThreeDartAvg: 0,
      };
      this.numLegs = gameConfig.numLegs;
   }

   /**
    * Determine if we can start the game
    *
    * @returns true if 2 players are in the room, false otherwise
    */
   shouldStart() {
      if (this.p1 && this.p2) {
         this.gameState.turn = this.p1;
         console.log("Game on! It's " + this.gameState.turn + "'s turn");
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

      if (this._isLegOver()) {
         this._handleLegOver();
      } else {
         this._swapTurns();
         console.log("It's now " + this.gameState.turn + "'s turn");
      }
   }

   _isLegOver() {
      if (this.gameState.p1Score === 0 || this.gameState.p2Score === 0) {
         return true;
      }
      return false;
   }

   _handleLegOver() {
      if (this.gameState.currentLeg === this.numLegs) {
         this._handleMatchOver();
      } else {
         // Figure out who won the leg & store the result
         if (this.gameState.p1Score === 0) {
            this.gameState.legWinners.push(this.p1);
         } else {
            this.gameState.legWinners.push(this.p2);
         }

         // Reset scores for the next leg and increment leg count
         this.gameState.p1Score = this.startingScore;
         this.gameState.p2Score = this.startingScore;
         this.gameState.currentLeg++;
      }
   }

   _handleMatchOver() {
      this.gameState.gameOver = true;

      if (this.gameState.p1Score === 0) {
         this.gameState.matchWinner = this.p1;
      } else {
         this.gameState.matchWinner = this.p2;
      }
      console.log('Game Over!');
      console.log('The winner is ' + this.gameState.matchWinner);
   }

   _scoreVisit(data) {
      if (data.score > 180 || data.score < 0) {
         // TODO: error
      } else {
         if (this.gameState.turn == this.p1) {
            this.stats.p1DartsThrown += data.dartsThrown;

            let remaining = this.gameState.p1Score - data.score;

            if (remaining >= 0) {
               this.stats.p1TotalScored += data.score;
               this.gameState.p1Score = remaining;
               console.log('Player ' + this.gameState.turn + ' scored ' + data.score);
            } else {
               console.log('Player ' + this.gameState.turn + ' busted!');
            }
            this.stats.p1ThreeDartAvg = (this.stats.p1TotalScored / this.stats.p1DartsThrown) * 3;
         } else {
            this.stats.p2DartsThrown += data.dartsThrown;

            let remaining = this.gameState.p2Score - data.score;

            if (remaining >= 0) {
               this.stats.p2TotalScored += data.score;
               this.gameState.p2Score = remaining;
               console.log('Player ' + this.gameState.turn + ' scored ' + data.score);
            } else {
               console.log('Player ' + this.gameState.turn + ' busted!');
            }
            this.stats.p1ThreeDartAvg = (this.stats.p1TotalScored / this.stats.p1DartsThrown) * 3;
         }
      }
   }

   _swapTurns() {
      if (this.gameState.turn == this.p1) {
         this.gameState.turn = this.p2;
      } else {
         this.gameState.turn = this.p1;
      }
   }
};
