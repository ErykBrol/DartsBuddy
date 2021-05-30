import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormControl from '@material-ui/core/FormControl';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { ValidatorForm } from 'react-material-ui-form-validator';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';

function Alert(props) {
   return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
   margin: {
      margin: theme.spacing(1),
   },
});

class X01Form extends Component {
   state = {
      startingScore: 0,
      numLegs: 0,
      open: false,
      roomCode: '',
   };

   handleChange = (e) => {
      this.setState({ ...this.state, [e.target.name]: parseInt(e.target.value) });
   };

   handleSubmit = () => {
      this.setState({ open: true });
      console.log(this.state);
   };

   handleClose = (event, reason) => {
      if (reason === 'clickaway') {
         return;
      }

      this.setState({ open: false });
   };

   render() {
      const { classes } = this.props;
      return (
         <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
               <Typography component="h1" variant="h5">
                  Create X01 Game
               </Typography>
               <ValidatorForm onSubmit={this.handleSubmit} className={classes.form}>
                  <Grid container spacing={2}>
                     <Grid item xs={12}>
                        <FormControl className={classes.form}>
                           <InputLabel htmlFor="demo-customized-select-native">Starting score</InputLabel>
                           <NativeSelect
                              name="startingScore"
                              onChange={this.handleChange}
                              required
                              id="demo-customized-select-native"
                           >
                              <option aria-label="None" value="" />
                              <option value={101}>101</option>
                              <option value={301}>301</option>
                              <option value={501}>501</option>
                              <option value={701}>701</option>
                           </NativeSelect>
                        </FormControl>
                     </Grid>
                     <Grid item xs={12}>
                        <FormControl className={classes.form}>
                           <InputLabel htmlFor="demo-customized-select-native">First to</InputLabel>
                           <NativeSelect
                              name="numLegs"
                              onChange={this.handleChange}
                              required
                              id="demo-customized-select-native"
                           >
                              <option aria-label="None" value="" />
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                           </NativeSelect>
                        </FormControl>
                     </Grid>
                  </Grid>
                  <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                     Create Game
                  </Button>
                  <Snackbar open={this.state.open} onClose={this.handleClose}>
                     <Alert onClose={this.handleClose} severity="success">
                        Room created! Join with code: {this.state.roomCode}
                     </Alert>
                  </Snackbar>
               </ValidatorForm>
            </div>
         </Container>
      );
   }
}

export default compose(withStyles(useStyles), withRouter, connect(null, actions))(X01Form);
