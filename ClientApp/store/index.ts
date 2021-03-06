import { ActionCreatorGeneric } from 'redux-typed';
import { reducer as formReducer } from 'redux-form';
import * as Polls from './Polls';
import * as AddPoll from './AddPoll';
import * as Auth from './Auth';


// The top-level state object
export interface ApplicationState {
  polls: Polls.PollsState;
  addPoll: AddPoll.AddPollState;
  auth: Auth.AuthState;
  form: any;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
  polls: Polls.reducer,
  addPoll: AddPoll.reducer,
  auth: Auth.reducer,
  form: formReducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export type ActionCreator = ActionCreatorGeneric<ApplicationState>;
