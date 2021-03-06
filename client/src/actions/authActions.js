import axios from 'axios';
import setAuthToken from './../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Register User
export const registerUser = userData => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(res => dispatch(loginUser({ email: userData.email, password: userData.password })))
    // .then(res => history.push('/browse'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const loginUser = (userData, callback) => dispatch => {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
    })
    .then(callback)
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

export const logoutUser = () => dispatch => {
  localStorage.removeItem('jwtToken');
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};

export const resetUser = () => dispatch => {};
