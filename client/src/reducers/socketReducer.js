/* eslint-disable import/no-anonymous-default-export */
import { CONNECT_TO_SOCKET, UPDATE_SOCKET } from '../actions/types';

const initalState = {
   socket: null,
   socketConnected: false,
};

export default function (state = initalState, action) {
   switch (action.type) {
      case CONNECT_TO_SOCKET:
         return {
            ...state,
            socketConnected: true,
         };
      case UPDATE_SOCKET:
         return {
            ...state,
            socket: action.payload,
         };
      default:
         return state;
   }
}
