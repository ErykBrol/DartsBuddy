import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import SignInScreen from './auth/SignInScreen';
import SignUpScreen from './auth/SignUpScreen';
import LandingScreen from './LandingScreen';
import Navbar from './Navbar';
import X01Form from './gameForms/X01Form';
import X01Screen from './gameScreens/X01Screen';

class App extends Component {
   componentDidMount() {
      this.props.fetchUser();
   }

   render() {
      return (
         <BrowserRouter>
            <Navbar />
            <Switch>
               <Route path="/" exact component={LandingScreen} />
               <Route path="/login" exact component={SignInScreen} />
               <Route path="/register" exact component={SignUpScreen} />
               <Route path="/create/X01" exact component={X01Form} />
               <Route path="/play/X01" exact component={X01Screen} />
            </Switch>
         </BrowserRouter>
      );
   }
}

export default connect(null, actions)(App);
