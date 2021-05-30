import axios from 'axios';
import { FETCH_USER, REGISTERED, LOGGED_IN, LOGGED_OUT } from './types';

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
      debugger;
      dispatch({ type: LOGGED_IN, payload: res.data });
      return true;
   }
};

export const logoutUser = () => async (dispatch) => {
   const res = await axios.get('/auth/logout');
   dispatch({ type: LOGGED_OUT, payload: res.data });
};
