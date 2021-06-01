import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TrackChanges from '@material-ui/icons/TrackChanges';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const useStyles = (theme) => ({
   paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
   },
   avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
   },
   form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
   },
   submit: {
      margin: theme.spacing(1),
   },
   logo: {
     margin: `${theme.spacing(3)}px 0 ${theme.spacing(4)}px`,
     width: '100%',
     height: '35vw',
     maxHeight: 200,
     color: theme.palette.secondary.main,
   }
});

class LandingScreen extends Component {
   getButtonsIfNotAuthed(auth, classes) {
      if (!auth) {
         return (
            <div>
               <Button href="/register" variant="contained" color="secondary" className={classes.submit}>
                  Sign Up
               </Button>
               <Button href="/login" variant="contained" color="primary" className={classes.submit}>
                  Login
               </Button>
            </div>
         );
      } else {
         return;
      }
   }
   render() {
      const { classes } = this.props;
      return (
         <div>
            <Container component="main" maxWidth="xs">
               <CssBaseline />
               <div className={classes.paper}>

                  <Typography component="h1" variant="h3" gutterBottom>
                     DartsBuddy
                  </Typography>
                  <TrackChanges className={classes.logo} />
                  <Typography component="p" variant="h6" align="center" gutterBottom>
                     DartsBuddy is a darts scoring app, allowing you to play online darts games against your friends!
                     Sign up for free or login to an existing account.
                  </Typography>
                  {this.getButtonsIfNotAuthed(this.props.auth, classes)}
               </div>
            </Container>
         </div>
      );
   }
}

function mapStateToProps({ auth }) {
   return { auth };
}

export default compose(withStyles(useStyles), withRouter, connect(mapStateToProps))(LandingScreen);
