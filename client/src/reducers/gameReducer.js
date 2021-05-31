/* eslint-disable import/no-anonymous-default-export */
import { CREATE_ROOM, UPDATE_ROOM, START_GAME, END_GAME, UPDATE_GAME, ENTER_ROOM } from '../actions/types';

const initalState = {
   roomId: null,
   connectedToRoom: false,
   players: {},
   gameState: {},
   gameOver: false,
   gameStart: false,
   winner: null,
};

export default function (state = initalState, action) {
   switch (action.type) {
      case CREATE_ROOM:
         return {
            ...state,
            roomId: action.payload.data.roomId,
         };
      case ENTER_ROOM:
         return {
            ...state,
            roomId: action.payload,
         };

      case UPDATE_ROOM:
         return {
            ...state,
            connectedToRoom: true,
         };
      case START_GAME:
         return {
            ...state,
            gameStart: true,
            gameState: action.payload.gameState,
            players: action.payload.players,
         };
      case END_GAME:
         return {
            ...state,
            gameOver: true,
            gameState: {},
            players: {},
            winner: action.payload,
         };
      case UPDATE_GAME:
         return {
            ...state,
            gameState: action.payload,
         };
      default:
         return state;
   }
}
