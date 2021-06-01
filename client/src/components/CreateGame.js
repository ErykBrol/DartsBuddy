import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import CreateIcon from '@material-ui/icons/Create';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Redirect } from 'react-router-dom';

import * as actions from '../actions';

const useStyles = (theme) => ({
   rightSideButtons: {
      textDecoration: 'none',
      color: '#FFFFFF',
   },
});

class CreateGame extends Component {
   state = {
      dropdownAnchorElement: null,
   };
   handleClick = (e) => {
      this.setState({ dropdownAnchorElement: e.currentTarget });
   };
   handleClose = () => {
      this.setState({ dropdownAnchorElement: null });
   };
   handleX01 = () => {
      this.handleClose();
      this.props.history.push('/create/X01');
   };

   anchorDropdown = () => {
      if (this.state.dropdownAnchorElement) {
         return (
            <Menu
               id="simple-menu"
               anchorEl={this.state.dropdownAnchorElement}
               getContentAnchorEl={null}
               anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
               }}
               transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
               }}
               elevation={0}
               keepMounted
               open={Boolean(this.state.dropdownAnchorElement)}
               onClose={this.handleClose}
               border="1px solid #d3d4d5"
               visible={this.state.dropdownAnchorElement}
            >
               <MenuItem className="dropdown" onClick={this.handleX01}>
                  X01
               </MenuItem>
            </Menu>
         );
      } else {
         return;
      }
   };

   render() {
      if (this.props.auth === false) {
         return <Redirect to="/login" />;
      }
      const { classes } = this.props;
      return (
         <label color="inherit">
            <Button
               aria-controls="simple-menu"
               aria-haspopup="true"
               onClick={this.handleClick}
               color="inherit"
               className={classes.rightSideButtons}
               component="span"
            >
               <CreateIcon />
            </Button>
            {this.anchorDropdown()}
         </label>
      );
   }
}

function mapStateToProps({ auth }) {
   return { auth };
}

export default compose(withStyles(useStyles), connect(mapStateToProps, actions), withRouter)(CreateGame);
