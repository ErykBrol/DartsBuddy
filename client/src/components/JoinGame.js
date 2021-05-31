import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';

import * as actions from '../actions';

const useStyles = (theme) => ({
   rightSideButtons: {
      textDecoration: 'none',
      color: '#FFFFFF',
   },
});

class JoinGame extends Component {
   state = {
      open: false,
      roomCode: '',
   };

   handleChange = (e) => {
      this.setState({ ...this.state, roomCode: e.target.value });
   };

   handleClickOpen = () => {
      this.setState({ open: true });
   };

   handleClose = () => {
      this.setState({ open: false });
   };

   handleRoomJoin = () => {
      this.props.joinRoom(this.state.roomCode);
      this.handleClose();
      this.props.history.push('/play/X01');
   };

   render() {
      const { classes } = this.props;
      return (
         <label color="inherit">
            <Button
               color="inherit"
               className={classes.rightSideButtons}
               component="span"
               onClick={this.handleClickOpen}
            >
               <PlayArrowIcon />
            </Button>
            <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
               <DialogTitle id="form-dialog-title">Join Game</DialogTitle>
               <DialogContent>
                  <TextField
                     value={this.state.roomCode}
                     onChange={this.handleChange}
                     autoFocus
                     margin="dense"
                     id="name"
                     label="Enter code here"
                     fullWidth
                  />
               </DialogContent>
               <DialogActions>
                  <Button onClick={this.handleClose} color="primary">
                     Cancel
                  </Button>
                  <Button onClick={this.handleRoomJoin} color="primary">
                     Join
                  </Button>
               </DialogActions>
            </Dialog>
         </label>
      );
   }
}

function mapStateToProps({ auth }) {
   return { auth };
}

export default compose(withStyles(useStyles), connect(mapStateToProps, actions), withRouter)(JoinGame);
