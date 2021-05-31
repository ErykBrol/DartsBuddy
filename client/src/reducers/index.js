import { combineReducers } from 'redux';
import authReducer from './authReducer';
import gameReducer from './gameReducer';
import socketReducer from './socketReducer';

export default combineReducers({
   auth: authReducer,
   socket: socketReducer,
   game: gameReducer,
});
