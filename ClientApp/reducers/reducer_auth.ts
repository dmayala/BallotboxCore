import { LOGIN_USER, LOGOUT_USER, LOAD_USER } from '../actions/index';
import {REHYDRATE} from 'redux-persist/constants';

const INITIAL_STATE = {
  username: '',
  isAuthenticated: false
};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case LOGIN_USER:
      if (action.payload.status === 200) {
        return Object.assign({}, { username: action.payload.data.username, isAuthenticated: true });
      }
    case LOGOUT_USER:
      return INITIAL_STATE;
    case LOAD_USER:
      return { username: action.payload.username };     
    case REHYDRATE:
      let incoming = action.payload.auth
      if (incoming) return Object.assign({}, state, incoming, { 
        isAuthenticated: localStorage.getItem('isAuthenticated') == 'true'
      });
    default:
      return state;
  }
};