import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';
import socketMiddleware from './middleware/socketMiddleware';
import gameMiddleware from './middleware/gameMiddleware';
import theme from './materialUITheme';
import { ThemeProvider } from '@material-ui/core/styles';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
   reducers,
   {},
   composeEnhancers(applyMiddleware(reduxThunk, socketMiddleware, gameMiddleware))
);

ReactDOM.render(
   <ThemeProvider theme={theme}>
      <Provider store={store}>
         <App />
      </Provider>
   </ThemeProvider>,
   document.querySelector('#root')
);
