import { FETCH_POLL, FETCH_POLLS, REMOVE_POLL } from '../actions/index';
import * as _ from 'lodash';

interface Poll {
  id: number;
}

interface S {
  all: Poll[];
  poll: Poll
}

interface IAction {
  payload: { data: any };
  type: any;
}

const INITIAL_STATE: S = {
  all: [],
  poll: null
};

function removePoll(state: S, action: IAction) {
  let id: number = action.payload.data.id;
  let copy: Poll[] = state.all.slice();
  copy.splice(_.findIndex(copy, (c) => c.id === id), 1);
  return Object.assign({}, state, { all: copy });
}

export default function(state = INITIAL_STATE, action: IAction) {
  switch(action.type) {
    case FETCH_POLL:
      return Object.assign({}, state, { poll: action.payload.data });
    case FETCH_POLLS:
      return Object.assign({}, state, { all: action.payload.data });
    case REMOVE_POLL:
      return removePoll(state, action);
    default:
      return state;
  }
};