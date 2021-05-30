import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import sizeMe from 'react-sizeme';
import * as actions from '../actions';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CssBaseline from '@material-ui/core/CssBaseline';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';

const useStyles = (theme) => ({
   root: {
      flexGrow: 1,
   },
   mainButton: {
      textDecoration: 'none',
      color: '#FFFFFF',
   },
   title: {
      flexGrow: 1,
      color: '#FFFFFF',
   },
   rightSideButtons: {
      textDecoration: 'none',
      color: '#FFFFFF',
   },
   leftAligned: {
      marginLeft: 'auto',
   },
   dropdown: {
      '&:focus': {
         backgroundColor: theme.palette.primary.main,
         '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
            color: theme.palette.common.white,
         },
      },
   },
});

class Navbar extends Component {
   state = {
      dropdownAnchorElement: null,
   };
   handleClick = (e) => {
      this.setState({ dropdownAnchorElement: e.currentTarget });
   };
   handleClose = () => {
      this.setState({ dropdownAnchorElement: null });
   };
   handleLogout = () => {
      this.handleClose();
      this.props.logoutUser();
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
               <MenuItem className="dropdown" onClick={this.handleLogout}>
                  Logout
               </MenuItem>
            </Menu>
         );
      } else {
         return;
      }
   };

   getAuthedItems(auth, classes, width) {
      if (auth) {
         return (
            <Fragment>
               <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={this.handleClick}
                  className={classes.rightSideButtons}
               >
                  <AccountCircleIcon style={{ marginRight: '5px' }} color="inherit" />
                  {width >= 500 && (
                     <Typography style={{ textTransform: 'none' }} variant="h6" className={classes.title}>
                        {`${auth.username}`}
                     </Typography>
                  )}
               </Button>
               {this.anchorDropdown()}
            </Fragment>
         );
      } else {
         return;
      }
   }

   getSignInButton(auth, classes) {
      if (auth === false) {
         return (
            <Link to="/login" className={classes.rightSideButtons}>
               <Button color="inherit">
                  <Typography style={{ textTransform: 'none' }} variant="h6" className={classes.title}>
                     Login
                  </Typography>
               </Button>
            </Link>
         );
      }
      return;
   }

   getTextOrIcon(width, classes) {
      return (
         <Fragment>
            <TrackChangesIcon />
            {width >= 500 && (
               <Typography style={{ marginLeft: '5px', textTransform: 'none' }} variant="h6" className={classes.title}>
                  DartsBuddy
               </Typography>
            )}
         </Fragment>
      );
   }

   render() {
      const {
         size: { width },
         classes,
      } = this.props;
      return (
         <div className={classes.root}>
            <CssBaseline />
            <AppBar position="static">
               <Toolbar>
                  <Link to="/" className={classes.mainButton}>
                     <Button color="inherit">{this.getTextOrIcon(width, classes)}</Button>
                  </Link>
                  <div className={classes.leftAligned}>
                     {this.getAuthedItems(this.props.auth, classes, width)}
                     {this.getSignInButton(this.props.auth, classes)}
                  </div>
               </Toolbar>
            </AppBar>
         </div>
      );
   }
}

function mapStateToProps({ auth }) {
   return { auth };
}

export default compose(sizeMe(), withStyles(useStyles), connect(mapStateToProps, actions))(Navbar);
