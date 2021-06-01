module.exports = class X01Lobby {
   constructor(game) {
      const config = game.config;
      this.game = game;
      this.p1 = null;
      this.p2 = null;
      this.numLegsToWin = config.numLegsToWin;
      this.startingScore = config.startingScore;
      this.gameState = {
         p1Score: config.startingScore,
         p2Score: config.startingScore,
         gameOver: false,
         matchWinner: null,
         currentPlayer: null,
         currentLeg: 1,
         p1LegsWon: 0,
         p2LegsWon: 0,
      };
      this.stats = {
         p1Visits: 0,
         p2Visits: 0,
         p1TotalScored: 0,
         p2TotalScored: 0,
      };
      this.error = null;
   }

   /**
    * Determine if we can start the game
    *
    * @returns true if 2 players are in the room, false otherwise
    */
   startGame() {
      if (this.p1 && this.p2) {
         this.gameState.currentPlayer = this.p1.username;
         console.log("Game on! It's " + this.gameState.currentPlayer + "'s turn");
         return true;
      }
      return false;
   }

   /**
    * Add this player to the game if possible
    *
    * @param user object of the player that's joining
    * @returns true on success, false on failure
    */
   joinGame(user) {
      if (!this.p1) {
         this.p1 = user;
         return true;
      } else if (!this.p2) {
         this.p2 = user;
         return true;
      } else {
         return false;
      }
   }

   /**
    * Process a currentPlayer being taken
    *
    * @param data object containing info about the player/move that was made
    * @param gameState object containing the state of the game before the move was made
    * @returns gameState updated after the move has been processed
    */
   play(data) {
      this._scoreVisit(data, this.gameState.p1Score);

      if (this._isLegOver()) {
         this._handleLegOver();
      }
   }

   /* TODO: add comment */
   updatePayload() {
      const payload = this.gameState;
      payload.matchWinner = this.gameState.matchWinner?.username;
      return payload;
   }

   _isLegOver() {
      if (this.gameState.p1Score === 0 || this.gameState.p2Score === 0) {
         return true;
      }
      return false;
   }

   _handleLegOver() {
      // Figure out who won the leg & store the result
      if (this.gameState.p1Score === 0) {
         this.gameState.p1LegsWon++;
      } else {
         this.gameState.p2LegsWon++;
      }

      if (this.gameState.p1LegsWon === this.numLegsToWin || this.gameState.p2LegsWon === this.numLegsToWin) {
         this._handleMatchOver();
      } else {
         console.log(
            'Game shot in leg #' +
               this.gameState.currentLeg +
               '. ' +
               this.gameState.currentPlayer +
               ' to throw first, game on!'
         );
         // Reset scores for the next leg and increment leg count
         this.gameState.p1Score = this.startingScore;
         this.gameState.p2Score = this.startingScore;
         this.gameState.currentLeg++;
      }
   }

   _handleMatchOver() {
      this.gameState.gameOver = true;

      if (this.gameState.p1LegsWon === this.numLegsToWin) {
         this.gameState.matchWinner = this.p1;
      } else {
         this.gameState.matchWinner = this.p2;
      }
      console.log('Game Over!');
      console.log('The winner is ' + this.gameState.matchWinner.username);

      this._saveUserStats();
      this._saveGame();
   }

   _scoreVisit(data) {
      let score = parseInt(data.score, 10);
      if (score > 180 || score < 0) {
         this.error = { msg: 'Score must be in the range of 0-180' };
      } else {
         if (this.gameState.currentPlayer == this.p1.username) {
            let remaining = this.gameState.p1Score - score;
            this.stats.p1Visits++;

            if (remaining >= 0) {
               this.stats.p1TotalScored += score;
               this.gameState.p1Score = remaining;
               console.log('Player ' + this.gameState.currentPlayer + ' scored ' + score);
            } else {
               console.log('Player ' + this.gameState.currentPlayer + ' busted!');
            }
         } else {
            let remaining = this.gameState.p2Score - score;
            this.stats.p2Visits++;

            if (remaining >= 0) {
               this.stats.p2TotalScored += score;
               this.gameState.p2Score = remaining;
               console.log('Player ' + this.gameState.currentPlayer + ' scored ' + score);
            } else {
               console.log('Player ' + this.gameState.currentPlayer + ' busted!');
            }
         }
         this._swapTurns();
      }
   }

   _swapTurns() {
      if (this.gameState.currentPlayer == this.p1.username) {
         this.gameState.currentPlayer = this.p2.username;
      } else {
         this.gameState.currentPlayer = this.p1.username;
      }
      console.log("It's now " + this.gameState.currentPlayer + "'s turn");
   }

   async _saveGame() {
      console.log('Saving game...');
      this.game.completed = true;
      this.game.p1 = this.p1;
      this.game.p2 = this.p2;
      this.game.winner = this.gameState.matchWinner;
      this.game.stats = this.stats;

      try {
         await this.game.save();
      } catch (err) {
         console.error('Unknown error: ', err);
      }
   }

   async _saveUserStats() {
      // P1 stats
      this.p1.totalVisits += this.stats.p1Visits;
      this.p1.totalScored += this.stats.p1TotalScored;
      this.p1.matchesPlayed++;
      if (this.gameState.matchWinner === this.p1) {
         this.p1.wins++;
      } else {
         this.p1.losses++;
      }

      // P2 stats
      this.p2.totalVisits += this.stats.p2Visits;
      this.p1.totalScored += this.stats.p1TotalScored;
      this.p2.matchesPlayed++;
      if (this.gameState.matchWinner === this.p2) {
         this.p2.wins++;
      } else {
         this.p2.losses++;
      }

      try {
         await this.p1.save();
         await this.p2.save();
      } catch (err) {
         console.error('Unknown error: ', err);
      }
   }
};
