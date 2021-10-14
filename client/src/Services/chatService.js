import {GETMESSAGE_ERROR} from '../actions/types';
import axios from 'axios';


// Get list of users conversations

export const useGetConversations = () => async dispatch => {
    try 
    {
        const config = {
            headers : {
                "Content-Type" : "application/json"
            }
        }
        const res = await api.get('/messages/conversations/');
    } 
    catch (err) 
    {
      dispatch({
        type: GETMESSAGE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };

// get conversation messages based on
// to and from id's

export const getConversationMessages = () => async dispatch => {
    try 
    {
      const res = await api.get(`/messages/conversations/${localStorage.currentUser.id}`);

    } 
    catch (err) 
    {
      dispatch({
        type: GETMESSAGE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  };



export const sendConversationMessage = (userId, bodyText) => async (dispatch) => {
    try 
    {
        const config = {
            headers : {
                "Content-Type" : "application/json"
            }
        }
        
        const bodyData = {
            to : userId,
            text : bodyText
        }

        const body = JSON.stringify(bodyData);

        const res = await axios.post('/messages', body, config);
    }
    catch (err) 
    {
        dispatch({
            type: GETMESSAGE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });     
    }
};
