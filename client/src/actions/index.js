import axios from 'axios';
import {
   FETCH_USER,
   REGISTERED,
   LOGGED_IN,
   LOGGED_OUT,
   CONNECT_TO_SOCKET,
   UPDATE_SOCKET,
   CREATE_ROOM,
   JOIN_ROOM,
   PLAY_GAME,
} from './types';

/* Authentication actions */
export const fetchUser = () => async (dispatch) => {
   const res = await axios.get('/auth/current_user');
   dispatch({ type: FETCH_USER, payload: res.data });
};

// userData should contain 2 things: username, password for the user being registered
export const registerUser = (userData) => async (dispatch) => {
   const res = await axios.post('/users/register', userData);

   if (res.status !== 201) {
      return false;
   } else {
      dispatch({ type: REGISTERED, payload: null });
      return true;
   }
};

// userData should contain 2 things: username, password for the user being registered
export const loginUser = (userData) => async (dispatch) => {
   const res = await axios.post('/auth/login', userData);
   if (res.status !== 200) {
      return false;
   } else {
      dispatch({ type: LOGGED_IN, payload: res.data });
      return true;
   }
};

export const logoutUser = () => async (dispatch) => {
   const res = await axios.get('/auth/logout');
   dispatch({ type: LOGGED_OUT, payload: res.data });
};

/* SocketIO - socket actions */
export const connectToSocket = () => (dispatch) => {
   dispatch({ type: CONNECT_TO_SOCKET, payload: null });
};

export const updateSocket = (socket) => (dispatch) => {
   dispatch({ type: UPDATE_SOCKET, payload: socket });
};

/* SocketIO - game actions */
export const createRoom = (roomConfig) => async (dispatch) => {
   const res = await axios.post(`/games/${roomConfig.gameConfig.type}`, roomConfig);
   if (res.status !== 201) {
      return false;
   } else {
      dispatch({ type: CREATE_ROOM, payload: res.data });
      return true;
   }
};

export const joinRoom = (roomId) => (dispatch) => {
   dispatch({ type: JOIN_ROOM, payload: roomId });
};

export const playGame = (data) => (dispatch) => {
   dispatch({ type: PLAY_GAME, payload: data });
};
