import { LOGIN_USER, LOGOUT_USER, LOAD_USER } from '../actions/index';
declare var app: any;

const INITIAL_STATE = {
  username: ''
};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case LOGIN_USER:
      if (action.payload.status === 200) {
        app.isLoggedIn = true;
        return { username: action.payload.data.username };
      }
    case LOGOUT_USER:
      return INITIAL_STATE;
    case LOAD_USER:
      return { username: action.payload.username };
    default:
      return state;
  }
};