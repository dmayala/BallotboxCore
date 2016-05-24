import { fetch } from 'domain-task/fetch';
import { typeName, isActionType, Action, Reducer } from 'redux-typed';
import { ActionCreator } from './';
import * as _ from 'lodash';
import { push } from 'react-router-redux'

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
  message?: string;
  username?: string;
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

@typeName("SIGNUP_COMPLETE")
class SignupComplete extends Action {
  constructor(public response: IAuthResponse) {
    super();
  }
}

@typeName("LOGIN_USER")
class LoginUser extends Action {
  constructor(public details: IAuthDetails) {
    super();
  }
}

@typeName("LOGIN_COMPLETE")
class LoginUserComplete extends Action {
  constructor(public response: IAuthResponse) {
    super();
  }
}

@typeName("LOGOUT_USER")
class LogoutUser extends Action {}

@typeName("LOGOUT_USER_COMPLETE")
class LogoutUserComplete extends LogoutUser {}

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
  signupUser: (details: ISignupDetails): ActionCreator => (dispatch, getState) => {
    fetch('/auth/register', {
      method: 'post',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(details)
    }).then(response => response.json())
      .then((data: IAuthResponse) => {
        dispatch(new SignupComplete(data));
      });
  },
  
  loginUser: (details: IAuthDetails): ActionCreator => (dispatch, getState) => {
    fetch('/auth/login', {
      method: 'post',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(details)    
    }).then(response => response.json())
      .then((data: IAuthResponse) => {
        dispatch(new LoginUserComplete(data));
      });

    dispatch(new LoginUser(details));     
    dispatch(push('/'));
  },
  
  logoutUser: (): ActionCreator => (dispatch, getState) => {
    fetch('/auth/logout', { method: 'post' })
      .then(response => response.json())
      .then(() => { dispatch(new LogoutUserComplete())});
      
    dispatch(new LogoutUser());
  },
  
  loadUser: (username: string): ActionCreator => (dispatch, getState) => {
    dispatch(new LoadUser(username));
  }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const unloadedState: AuthState = { username: null, isAuthenticated: false };
export const reducer: Reducer<AuthState> = (state, action) => {
    
  switch(action.type) {
    case SignupComplete.prototype.type: 
      return { username: (action as SignupComplete).response.username, isAuthenticated: true };
    case LoginUserComplete.prototype.type:
      return { username: (action as LoginUserComplete).response.username, isAuthenticated: true };
    case LogoutUserComplete.prototype.type:
      return unloadedState;   
    case LoadUser.prototype.type:
      return { username: (action as LoadUser).username, isAuthenticated: true };
  }

  // For unrecognized actions (or in cases where actions have no effect), must return the existing state
  // (or default initial state if none was supplied)
  return state || unloadedState;
};
