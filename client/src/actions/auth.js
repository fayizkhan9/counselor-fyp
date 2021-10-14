import api from '../utils/api';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from './types';

// Load User
export const loadUser = () => async dispatch => {

  try 
  {
    const res = await api.get('/auth');
    
    localStorage.setItem('userType', res.data.userType)

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });

   

  } 
  catch (err) 
  {
    dispatch({
      type: AUTH_ERROR
    });
  }
};


// Register User
export const register = formData => async dispatch => {
  try {

    const sendData = new FormData();
    sendData.append('name', formData.name)
    sendData.append('email', formData.email)
    sendData.append('phNo', formData.phNo)
    sendData.append('password', formData.password)
    sendData.append('userType', formData.userType)
    sendData.append('image', formData.file)

    const res = await api.post('/users', sendData);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  }
  catch
  (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};


// Login User
export const login = (email, password) => async dispatch => {

  const body = { email, password };

  try {
    const res = await api.post('/auth', body);

    const token = {
      token: res.data.sendData.token
    };

    dispatch({
      type: LOGIN_SUCCESS,
      payload: token
    });

    dispatch(loadUser());

  }
  catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Logout
export const logout = () => (

  { type: LOGOUT }

);