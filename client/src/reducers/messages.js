import {
    GETMESSAGE_ERROR
  } from '../actions/types';
  
  const initialState = {
    token: localStorage.getItem('token'),
    getMessage : false
  };
  
  function messageReducer(state = initialState, action) 
  {
    switch (type) 
    {
      case GETMESSAGE_ERROR:
        return {
          ...state,
          getMessage: true
        };
      default:
        return state;
    }
  }
  
  export default messageReducer;
  