import { FETCH_POLLS } from '../actions/index';

const INITIAL_STATE = {
  all: []
};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FETCH_POLLS:
      return { all: action.payload.data || [] };
    default:
      return state;
  }
};