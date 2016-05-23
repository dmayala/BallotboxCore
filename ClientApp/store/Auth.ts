import { fetch } from 'domain-task/fetch';
import { typeName, isActionType, Action, Reducer } from 'redux-typed';
import { ActionCreator } from './';
import * as _ from 'lodash';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface AuthState {
  username: string;
  isAuthenticated: boolean;
}

export interface IAuthDetails {
  username: string;
  password: string;
}

export interface ISignupDetails extends IAuthDetails {
  email: string;
  confirmPassword: string;
}

export interface IAuthResponse {
  message: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

@typeName("SIGNUP")
class Signup extends Action {
  constructor(public details: ISignupDetails) {
    super();
  }
}

@typeName("LOGIN_USER")
class LoginUser extends Action {
  constructor(public details: IAuthDetails) {
    super();
  }
}

@typeName("LOGOUT_USER")
class LogoutUser extends Action {
  constructor() {
    super();
  }
}

@typeName("LOAD_USER")
class LoadUser extends Action {
  constructor(public username: string) {
    super();
  }
}

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
  loginUser: (details: IAuthDetails): ActionCreator => (dispatch, getState) => {
    fetch('/auth/login', {
      method: 'post'
    }).then(response => response.json())
      .then((data: IAuthResponse) => {
        console.log(data);
      });

    dispatch(new LoginUser(details));     
  }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const unloadedState: AuthState = { username: null, isAuthenticated: false };
export const reducer: Reducer<AuthState> = (state, action) => {
    
  if (isActionType(action, LoginUser)) {
    return { username: action.details.username, isAuthenticated: true };
  } 

  // For unrecognized actions (or in cases where actions have no effect), must return the existing state
  // (or default initial state if none was supplied)
  return state || unloadedState;
};
