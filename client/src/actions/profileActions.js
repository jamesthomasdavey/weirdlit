import axios from 'axios';
import { GET_PROFILE, PROFILE_LOADING, GET_ERRORS, CLEAR_CURRENT_PROFILE } from './types';

// get current profile
export const getCurrentProfile = callback => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get('/api/profile')
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .then(callback)
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

// update current profile
export const updateCurrentProfile = (profileData, history, callback) => dispatch => {
  axios
    .put('/api/profile', profileData)
    .then(res => {
      history.push('/profile');
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });
    })
    .catch(err => {
      callback();
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
