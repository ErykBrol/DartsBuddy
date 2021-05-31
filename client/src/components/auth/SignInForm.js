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
      marginTop: theme.spacing(1),
   },
   submit: {
      margin: theme.spacing(3, 0, 2),
   },
});

class SignIn extends Component {
   state = {
      username: '',
      password: '',
      error: '',
   };

   handleChange = (e) => {
      this.setState({ ...this.state, error: '', [e.target.name]: e.target.value });
   };

   handleSubmit = () => {
      this.props
         .loginUser({ username: this.state.username, password: this.state.password })
         .then((result) => {
            this.setState({ error: result ? '' : 'Invalid username or password' });
            if (result) {
               this.props.connectToSocket();
               this.props.history.push({
                  pathname: '/',
               });
            }
         })
         .catch((err) => {
            alert(err.response.data.msg);
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
                  Sign in
               </Typography>
               <ValidatorForm onSubmit={this.handleSubmit} className={classes.form}>
                  <Grid container spacing={2}>
                     <Grid item xs={12}>
                        <TextValidator
                           variant="outlined"
                           margin="normal"
                           fullWidth
                           id="username"
                           label="Username"
                           name="username"
                           autoFocus
                           value={this.state.username}
                           onChange={this.handleChange}
                           validators={['required']}
                           errorMessages={['You must enter a username']}
                           error={this.state.error ? true : false}
                           helperText={this.state.error}
                        />
                     </Grid>
                     <Grid item xs={12}>
                        <TextValidator
                           variant="outlined"
                           margin="normal"
                           fullWidth
                           name="password"
                           label="Password"
                           type="password"
                           id="password"
                           value={this.state.password}
                           onChange={this.handleChange}
                           validators={['required']}
                           errorMessages={['You must enter a password']}
                           error={this.state.error ? true : false}
                           helperText={this.state.error}
                        />
                     </Grid>
                  </Grid>
                  <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                     Sign In
                  </Button>
                  <Link to="/register" variant="body2">
                     Don't have an account? Sign Up
                  </Link>
               </ValidatorForm>
            </div>
         </Container>
      );
   }
}

export default compose(withStyles(useStyles), withRouter, connect(null, actions))(SignIn);
