import { LOGIN_USER } from '../actions/index';

const INITIAL_STATE = {
  username: ''
};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case LOGIN_USER:
      if (action.payload.status === 200) {
        return { username: action.payload.data.username };
      }
    default:
      return state;
  }
};