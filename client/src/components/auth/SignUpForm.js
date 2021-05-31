import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';

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
      margin: theme.spacing(3, 0, 2),
   },
});

class SignUp extends Component {
   state = {
      username: '',
      password: '',
      error: '',
   };

   componentDidMount() {
      // Add a custom validation rule for username length
      ValidatorForm.addValidationRule('usernameLength', (value) => {
         if (value.length < 3 || value.length > 20) {
            return false;
         }
         return true;
      });

      // Add a custom validation rule for password length
      ValidatorForm.addValidationRule('passwordLength', (value) => {
         if (value.length <= 3) {
            return false;
         }
         return true;
      });
   }

   componentWillUnmount() {
      // remove rules when it is not needed
      ValidatorForm.removeValidationRule('usernameLength');
      ValidatorForm.removeValidationRule('passwordLength');
   }

   handleChange = (e) => {
      this.setState({ ...this.state, [e.target.name]: e.target.value, error: '' });
   };

   handleSubmit = () => {
      this.props.registerUser({ username: this.state.username, password: this.state.password }).then((result) => {
         this.setState({ error: result ? '' : 'A user with this username already exists' });
         if (result) {
            this.props.loginUser({ username: this.state.username, password: this.state.password }).then((result) => {
               if (result) {
                  this.props.connectToSocket();
                  this.props.history.push({
                     pathname: '/',
                  });
               }
            });
         }
      });
   };

   render() {
      const { classes } = this.props;
      return (
         <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
               <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
               </Avatar>
               <Typography component="h1" variant="h5">
                  Sign up
               </Typography>
               <ValidatorForm onSubmit={this.handleSubmit} className={classes.form}>
                  <Grid container spacing={2}>
                     <Grid item xs={12}>
                        <TextValidator
                           validators={['required', 'usernameLength']}
                           variant="outlined"
                           fullWidth
                           id="username"
                           label="Username"
                           name="username"
                           value={this.state.username}
                           onChange={this.handleChange}
                           errorMessages={[
                              'You must enter a username',
                              'Username must be between 3 and 20 characters long',
                           ]}
                           error={this.state.error ? true : false}
                           helperText={this.state.error}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextValidator
                           validators={['required', 'passwordLength']}
                           variant="outlined"
                           fullWidth
                           name="password"
                           label="Password"
                           type="password"
                           id="password"
                           value={this.state.password}
                           onChange={this.handleChange}
                           errorMessages={['You must enter a password', 'Password must be more than 3 characters long']}
                        />
                     </Grid>
                  </Grid>
                  <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                     Sign Up
                  </Button>
                  <Link to="login" variant="body2">
                     Already have an account? Sign in
                  </Link>
               </ValidatorForm>
            </div>
         </Container>
      );
   }
}

export default compose(withStyles(useStyles), withRouter, connect(null, actions))(SignUp);
