import {
   JOIN_ROOM,
   UPDATE_ROOM,
   START_GAME,
   END_GAME,
   PLAY_GAME,
   UPDATE_GAME,
   ENTER_ROOM,
   UPDATE_ERR,
} from '../actions/types';

const gameMiddleware = (store) => (next) => (action) => {
   const state = store.getState();
   const socket = state.socket.socket;

   if (!socket) {
      next(action);
      return;
   }

   switch (action.type) {
      case JOIN_ROOM:
         socket.emit('joinRoom', { username: state.auth.username, roomId: action.payload });
         socket.on('room_joined', (roomId) => {
            store.dispatch({
               type: ENTER_ROOM,
               payload: roomId,
            });
            store.dispatch({
               type: UPDATE_ROOM,
               payload: null,
            });
         });

         socket.on('update_game', (gameState) => {
            store.dispatch({
               type: UPDATE_GAME,
               payload: gameState,
            });
         });

         socket.on('start_game', (gameState) => {
            store.dispatch({
               type: START_GAME,
               payload: gameState,
            });
         });

         socket.on('game_over', (gameState) => {
            store.dispatch({
               type: END_GAME,
               payload: gameState.matchWinner,
            });
         });
         socket.on('err', (data) => {
            console.log(data);
            store.dispatch({
               type: UPDATE_ERR,
               payload: data,
            });
         });
         break;
      case PLAY_GAME:
         socket.emit('play', action.payload);
         break;
      default:
         break;
   }

   next(action);
};

export default gameMiddleware;
