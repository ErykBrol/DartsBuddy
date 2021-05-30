import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import SignInScreen from './auth/SignInScreen';
import SignUpScreen from './auth/SignUpScreen';
import LandingScreen from './LandingScreen';

class App extends Component {
   componentDidMount() {
      this.props.fetchUser();
   }

   render() {
      return (
         <BrowserRouter>
            <div>
               <Switch>
                  <Route path="/" exact component={LandingScreen} />
                  <Route path="/login" exact component={SignInScreen} />
                  <Route path="/register" exact component={SignUpScreen} />
               </Switch>
            </div>
         </BrowserRouter>
      );
   }
}

export default connect(null, actions)(App);
