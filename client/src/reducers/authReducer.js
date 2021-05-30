/* eslint-disable import/no-anonymous-default-export */
import { FETCH_USER, REGISTERED, LOGGED_IN, LOGGED_OUT } from '../actions/types';

const initalState = {};

export default function (state = initalState, action) {
   switch (action.type) {
      case REGISTERED:
         return state;
      case LOGGED_IN:
         return action.payload;
      case LOGGED_OUT:
         return false;
      case FETCH_USER:
         return action.payload || false;
      default:
         return state;
   }
}
