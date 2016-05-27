import * as axios from 'axios';
import { typeName, isActionType, Action, Reducer } from 'redux-typed';
import { ActionCreator } from './';
import * as _ from 'lodash';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface AddPollState {
  success: boolean;
  isLoading: boolean;
  pollId: number;
}

export interface Poll {
  id?: number;
  name: string;
  choices: string[];
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.
@typeName("ADD_POLL")
class AddPoll extends Action {
  constructor(public details: Poll) {
    super();
  }
}

@typeName("ADD_POLL_SUCCESS")
class AddPollSuccess extends AddPoll {}

@typeName("ADD_POLL_FAILURE")
class AddPollFailure extends Action {}

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
  addPoll: (details: Poll): ActionCreator => (dispatch, getState) => {
    axios.post('/api/polls', details)
      .then(response => {
        if (response.status !== 201) { throw new Error(); }
        dispatch(new AddPollSuccess(response.data as Poll));
      })
      .catch((error: Error) => {
        dispatch(new AddPollFailure());
      });
         
    new AddPoll(details);
  }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const unloadedState: AddPollState = { success: null, isLoading: false, pollId: 0 };
export const reducer: Reducer<AddPollState> = (state, action) => {
  
  if (isActionType(action, AddPoll)) {
    return { success: null, isLoading: true, pollId: state.pollId };
  } else if (isActionType(action, AddPollSuccess)) {
    return { success: true, isLoading: false, pollId: action.details.id };
  } else if (isActionType(action, AddPollFailure)) {
    return { success: false, isLoading: false, pollId: 0 };
  }
  
  // For unrecognized actions (or in cases where actions have no effect), must return the existing state
  // (or default initial state if none was supplied)
  return state || unloadedState;
};
