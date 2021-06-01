import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import * as actions from '../../actions';

const useStyles = (theme) => ({
   root: {
      flexGrow: 1,
      justifyContent: 'center',
   },
   paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
   },
   scoreboardPaper: {
      backgroundColor: '#E8E8E8',
      margin: '0 auto',
      width: '100%',
      textAlign: 'center',
      padding: '10px',
   },
});

class X01Screen extends Component {
   state = {
      inputScore: '',
   };

   handleEraseClick = () => {
      this.setState({ inputScore: this.state.inputScore.slice(0, -1) });
   };

   handleScoreSubmit = () => {
      console.log(this.state.inputScore);
      if (this.validateX01Score()) {
         this.props.playGame({ roomId: this.props.game.roomId, score: this.state.inputScore });
         this.setState({ inputScore: '' });
      } else {
         alert('Score must be between 0-180');
      }
   };

   handleInputChange = (e) => {
      // Only accept numbers
      const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
         this.setState({ inputScore: e.target.value });
      }
   };

   validateX01Score = () => {
      if (this.state.inputScore > 180) {
         return false;
      }
      return true;
   };

   getGameOverScreen = () => {
      return (
         <Dialog
            open={this.props.game.gameOver}
            onClose={() => {
               this.props.history.push('/');
            }}
            aria-labelledby="form-dialog-title"
         >
            <DialogTitle id="form-dialog-title">Game Over!</DialogTitle>
            {this.props.auth.username === this.props.game.winner ? (
               <DialogContent>You won! :)</DialogContent>
            ) : (
               <DialogContent>You lost! :(</DialogContent>
            )}
            <DialogActions>
               <Button
                  onClick={() => {
                     this.props.history.push('/');
                  }}
                  color="primary"
               >
                  Exit
               </Button>
            </DialogActions>
         </Dialog>
      );
   };

   render() {
      if (this.props.auth === false) {
         return <Redirect to="/login" />;
      }
      // console.log(this.props.game.roomId);
      // if (!this.props.game.roomId) {
      //    return <Redirect to="/" />;
      // }
      const { classes } = this.props;
      let isMyTurn = this.props.auth.username === this.props.game.gameState.turn;
      return (
         <div>
            {this.props.game.gameOver ? this.getGameOverScreen() : null}
            <div
               id="scoreboard"
               style={{ width: '50%', margin: '50px auto 25px auto', display: 'flex', justifyContent: 'center' }}
            >
               <Paper className={classes.scoreboardPaper} elevation={3}>
                  <Typography style={{ textTransform: 'none' }} variant="h2" className={classes.title}>
                     {`${this.props.game.gameState.p1Score}`}
                  </Typography>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                     {this.props.game.players.p1 === this.props.game.gameState.turn ? (
                        <FiberManualRecordIcon color="secondary" />
                     ) : null}
                     <Typography style={{ textTransform: 'none' }} variant="h6" className={classes.title}>
                        {`${this.props.game.players.p1}`}
                     </Typography>
                  </div>
                  <Typography style={{ textTransform: 'none' }} variant="subtitle2" className={classes.title}>
                     {`Legs: ${this.props.game.gameState.p1LegsWon}`}
                  </Typography>
               </Paper>
               <Paper className={classes.scoreboardPaper} elevation={3}>
                  <Typography style={{ textTransform: 'none' }} variant="h2" className={classes.title}>
                     {`${this.props.game.gameState.p2Score}`}
                  </Typography>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                     {this.props.game.players.p2 === this.props.game.gameState.turn ? (
                        <FiberManualRecordIcon color="secondary" />
                     ) : null}
                     <Typography style={{ textTransform: 'none' }} variant="h6" className={classes.title}>
                        {`${this.props.game.players.p2}`}
                     </Typography>
                  </div>
                  <Typography style={{ textTransform: 'none' }} variant="subtitle2" className={classes.title}>
                     {`Legs: ${this.props.game.gameState.p2LegsWon}`}
                  </Typography>
               </Paper>
            </div>
            <div
               id="inputBox"
               style={{ width: '50%', margin: '50px auto 25px auto', display: 'flex', justifyContent: 'center' }}
            >
               <TextField
                  disabled={!isMyTurn}
                  onChange={this.handleInputChange}
                  value={this.state.inputScore}
                  id="scoreInput"
                  variant="filled"
               />
            </div>
            <div id="numberPad">
               <div
                  style={{ width: '50%', margin: '0 auto', display: 'flex', justifyContent: 'center' }}
                  className={classes.root}
               >
                  <ButtonGroup variant="contained" color="primary">
                     <Button
                        disabled={!isMyTurn}
                        onClick={() => {
                           this.setState({ inputScore: this.state.inputScore + '1' });
                        }}
                        style={{ borderRadius: '0px', minWidth: '100px' }}
                        className={classes.paper}
                     >
                        <Typography
                           style={{ textTransform: 'none', color: '#FFFFFF' }}
                           variant="h6"
                           className={classes.title}
                        >
                           1
                        </Typography>
                     </Button>
                     <Button
                        disabled={!isMyTurn}
                        onClick={() => {
                           this.setState({ inputScore: this.state.inputScore + '2' });
                        }}
                        style={{ borderRadius: '0px', minWidth: '100px' }}
                        className={classes.paper}
                     >
                        <Typography
                           style={{ textTransform: 'none', color: '#FFFFFF' }}
                           variant="h6"
                           className={classes.title}
                        >
                           2
                        </Typography>
                     </Button>
                     <Button
                        disabled={!isMyTurn}
                        onClick={() => {
                           this.setState({ inputScore: this.state.inputScore + '3' });
                        }}
                        style={{ borderRadius: '0px', minWidth: '100px' }}
                        className={classes.paper}
                     >
                        <Typography
                           style={{ textTransform: 'none', color: '#FFFFFF' }}
                           variant="h6"
                           className={classes.title}
                        >
                           3
                        </Typography>
                     </Button>
                  </ButtonGroup>
               </div>
               <div
                  style={{ width: '50%', margin: '0 auto', display: 'flex', justifyContent: 'center' }}
                  className={classes.root}
               >
                  <ButtonGroup variant="contained" color="primary">
                     <Button
                        disabled={!isMyTurn}
                        onClick={() => {
                           this.setState({ inputScore: this.state.inputScore + '4' });
                        }}
                        style={{ borderRadius: '0px', minWidth: '100px' }}
                        className={classes.paper}
                     >
                        <Typography
                           style={{ textTransform: 'none', color: '#FFFFFF' }}
                           variant="h6"
                           className={classes.title}
                        >
                           4
                        </Typography>
                     </Button>
                     <Button
                        disabled={!isMyTurn}
                        onClick={() => {
                           this.setState({ inputScore: this.state.inputScore + '5' });
                        }}
                        style={{ borderRadius: '0px', minWidth: '100px' }}
                        className={classes.paper}
                     >
                        <Typography
                           style={{ textTransform: 'none', color: '#FFFFFF' }}
                           variant="h6"
                           className={classes.title}
                        >
                           5
                        </Typography>
                     </Button>
                     <Button
                        disabled={!isMyTurn}
                        onClick={() => {
                           this.setState({ inputScore: this.state.inputScore + '6' });
                        }}
                        style={{ borderRadius: '0px', minWidth: '100px' }}
                        className={classes.paper}
                     >
                        <Typography
                           style={{ textTransform: 'none', color: '#FFFFFF' }}
                           variant="h6"
                           className={classes.title}
                        >
                           6
                        </Typography>
                     </Button>
                  </ButtonGroup>
               </div>
               <div
                  style={{ width: '50%', margin: '0 auto', display: 'flex', justifyContent: 'center' }}
                  className={classes.root}
               >
                  <ButtonGroup variant="contained" color="primary">
                     <Button
                        disabled={!isMyTurn}
                        onClick={() => {
                           this.setState({ inputScore: this.state.inputScore + '7' });
                        }}
                        style={{ borderRadius: '0px', minWidth: '100px' }}
                        className={classes.paper}
                     >
                        <Typography
                           style={{ textTransform: 'none', color: '#FFFFFF' }}
                           variant="h6"
                           className={classes.title}
                        >
                           7
                        </Typography>
                     </Button>
                     <Button
                        disabled={!isMyTurn}
                        onClick={() => {
                           this.setState({ inputScore: this.state.inputScore + '8' });
                        }}
                        style={{ borderRadius: '0px', minWidth: '100px' }}
                        className={classes.paper}
                     >
                        <Typography
                           style={{ textTransform: 'none', color: '#FFFFFF' }}
                           variant="h6"
                           className={classes.title}
                        >
                           8
                        </Typography>
                     </Button>
                     <Button
                        disabled={!isMyTurn}
                        onClick={() => {
                           this.setState({ inputScore: this.state.inputScore + '9' });
                        }}
                        style={{ borderRadius: '0px', minWidth: '100px' }}
                        className={classes.paper}
                     >
                        <Typography
                           style={{ textTransform: 'none', color: '#FFFFFF' }}
                           variant="h6"
                           className={classes.title}
                        >
                           9
                        </Typography>
                     </Button>
                  </ButtonGroup>
               </div>
               <div
                  style={{ width: '50%', margin: '0 auto', display: 'flex', justifyContent: 'center' }}
                  className={classes.root}
               >
                  <ButtonGroup variant="contained" color="primary">
                     <Button
                        disabled={!isMyTurn}
                        onClick={this.handleEraseClick}
                        color="secondary"
                        style={{ borderRadius: '0px', minWidth: '100px' }}
                        className={classes.paper}
                     >
                        <KeyboardBackspaceIcon style={{ color: '#FFFFFF' }} />
                     </Button>
                     <Button
                        disabled={!isMyTurn}
                        onClick={() => {
                           this.setState({ inputScore: this.state.inputScore + '0' });
                        }}
                        style={{ borderRadius: '0px', minWidth: '100px' }}
                        className={classes.paper}
                     >
                        <Typography
                           style={{ textTransform: 'none', color: '#FFFFFF' }}
                           variant="h6"
                           className={classes.title}
                        >
                           0
                        </Typography>
                     </Button>
                     <Button
                        disabled={!isMyTurn}
                        onClick={this.handleScoreSubmit}
                        color="secondary"
                        style={{ borderRadius: '0px', minWidth: '100px' }}
                        className={classes.paper}
                     >
                        <SubdirectoryArrowRightIcon style={{ color: '#FFFFFF' }} />
                     </Button>
                  </ButtonGroup>
               </div>
            </div>
         </div>
      );
   }
}

function mapStateToProps({ auth, game }) {
   return { auth, game };
}

export default compose(withStyles(useStyles), connect(mapStateToProps, actions))(X01Screen);
