import io from 'socket.io-client';

import { CONNECT_TO_SOCKET, UPDATE_SOCKET } from '../actions/types';

let socket = null;

const socketMiddleware = (store) => (next) => (action) => {
   switch (action.type) {
      case CONNECT_TO_SOCKET:
         socket = io('http://localhost:5000');
         store.dispatch({
            type: UPDATE_SOCKET,
            payload: socket,
         });
         break;
      default:
         break;
   }

   next(action);
};

export default socketMiddleware;
