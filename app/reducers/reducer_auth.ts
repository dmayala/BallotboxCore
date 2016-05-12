import { LOGIN_USER, LOGOUT_USER } from '../actions/index';

const INITIAL_STATE = {
  username: ''
};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case LOGIN_USER:
      if (action.payload.status === 200) {
        return { username: action.payload.data.username };
      }
    case LOGOUT_USER:
      return INITIAL_STATE;
    default:
      return state;
  }
};