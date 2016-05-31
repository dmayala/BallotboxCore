import { fetch } from 'domain-task/fetch';
import { typeName, isActionType, Action, Reducer } from 'redux-typed';
import { ActionCreator } from './';
import * as _ from 'lodash';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface PollsState {
  all: Poll[];
  poll: Poll;
  isLoading: Boolean;
}

export interface Poll {
  id?: number;
  name: string;
  choices: Choice[]
}

export interface Choice {
  id?: number;
  name: string;
  votes?: Vote[]
}

export interface Vote {
  id: number;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.
@typeName("REQUEST_POLLS")
class RequestPolls extends Action {
  constructor(public username: string) {
    super();
  }
}

@typeName("RECEIVE_POLLS")
class ReceivePolls extends Action {
  constructor(public all: Poll[]) {
    super();
  }
}

@typeName("REQUEST_POLLS")
class RequestPoll extends Action {
  constructor(public pollId: number) {
    super();
  }
}

@typeName("RECEIVE_POLL")
class ReceivePoll extends Action {
  constructor(public poll: Poll) {
    super();
  }
}

@typeName("ADD_POLL")
class AddPoll extends Action {
  constructor(public details: Poll) {
    super();
  }
}

@typeName("ADD_POLL_COMPLETE")
class AddPollComplete extends AddPoll {}

@typeName("REMOVE_POLL")
class RemovePoll extends Action {
  constructor(public pollId: number) {
    super();
  }
}

@typeName("REMOVE_POLL_COMPLETE")
class RemovePollComplete extends RemovePoll {}

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
  requestPolls: (username: string): ActionCreator => (dispatch, getState) => {
    let bearer = getState().auth.token;
    fetch(`/api/polls/user/${username}`, {
      headers: {
        'Authorization': `Bearer ${bearer}`
      }
    })
      .then(response => response.json())
      .then((data: Poll[]) => {
        dispatch(new ReceivePolls(data));
      });

    dispatch(new RequestPolls(username));     
  },
  
  requestPoll: (pollId: number): ActionCreator => (dispatch, getState) => {
    let bearer = getState().auth.token;
      fetch(`/api/polls/${pollId}`, {
        headers: {
          'Authorization': `Bearer ${bearer}`
        }
      })
        .then(response => response.json())
        .then((data: Poll) => {
          dispatch(new ReceivePoll(data));
        });
  },
  
  addPoll: (details: Poll): ActionCreator => (dispatch, getState) => {
    let bearer = getState().auth.token;
    fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearer}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(details)
      })
      .then(response => response.json())
      .then((data: Poll) => {
        dispatch(new AddPollComplete(data));
      });   
  },
  
  removePoll: (pollId: number): ActionCreator => (dispatch, getState) => {
    let bearer = getState().auth.token;
    fetch(`/api/polls/${pollId}`, {
      method: 'delete',
      headers: {
        'Authorization': `Bearer ${bearer}`,
      }
    }).then(response => response.json())
      .then((pollId: number) => {
          dispatch(new RemovePollComplete(pollId));
      });
  },
  
  vote: (pollId: number, choiceId: number): ActionCreator => (dispatch, getState) => {
    let bearer = getState().auth.token;
    fetch(`/api/polls/${pollId}/choices/${choiceId}`, {
      method: 'post',
      headers: {
        'Authorization': `Bearer ${bearer}`,
      }
    });
  }
};

// ----------------
// REDUCER Helpers 

function removePoll(state: PollsState, action: RemovePollComplete) {
  let id: number = action.pollId;
  let copy: Poll[] = state.all.slice();
  copy.splice(_.findIndex(copy, (c) => c.id === id), 1);
  return Object.assign({}, state, { all: copy });
}

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const unloadedState: PollsState = { all: [], poll: null, isLoading: false };
export const reducer: Reducer<PollsState> = (state, action) => {
    switch (action.type) {
      case RequestPolls.prototype.type, RequestPoll.prototype.type:
        return Object.assign({}, state, { isLoading: true });
      case ReceivePolls.prototype.type:
        return Object.assign({}, state, { all: (action as ReceivePolls).all });
      case ReceivePoll.prototype.type: 
        return Object.assign({}, state, { poll: (action as ReceivePoll).poll });
      case RemovePollComplete.prototype.type:
        return removePoll(state, action as RemovePollComplete);
  }

  // For unrecognized actions (or in cases where actions have no effect), must return the existing state
  // (or default initial state if none was supplied)
  return state || unloadedState;
};
