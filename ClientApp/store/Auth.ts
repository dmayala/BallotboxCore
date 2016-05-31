import { fetch } from 'domain-task/fetch';
import * as axios from 'axios';
import { typeName, isActionType, Action, Reducer } from 'redux-typed';
import { ActionCreator } from './';
import * as _ from 'lodash';
import { push } from 'react-router-redux'
import * as cookie from 'react-cookie';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface AuthState {
  username: string;
  token: string;
  isAuthenticated: boolean;
  failureMessage: string;
}

export interface IAuthDetails {
  username: string;
  password: string;
}

export interface ITokenizedDetails {
  username: string;
  token: string;
}

export interface ISignupDetails extends IAuthDetails {
  email: string;
  confirmPassword: string;
}

export interface IAuthResponse {
  message?: string;
  username?: string;
  token?: string;
  status?: number;
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

@typeName("SIGNUP_SUCCESS")
class SignupSuccess extends Action {
  constructor(public response: IAuthResponse) {
    super();
  }
}

@typeName("SIGNUP_FAILURE")
class SignupFailure extends Action {
  constructor(public message: string) {
    super();
  }
}

@typeName("LOGIN_USER")
class LoginUser extends Action {
  constructor(public details: IAuthDetails) {
    super();
  }
}

@typeName("LOGIN_USER_SUCCESS")
class LoginUserSuccess extends Action {
  constructor(public response: IAuthResponse) {
    super();
  }
}

@typeName("LOGIN_USER_FAILURE")
class LoginUserFailure extends Action {
  constructor(public message: string) {
    super();
  }
}

@typeName("LOGOUT_USER")
class LogoutUser extends Action {}

@typeName("LOGOUT_USER_COMPLETE")
class LogoutUserComplete extends LogoutUser {}

@typeName("LOAD_USER")
export class LoadUser extends Action {
  constructor(public details: ITokenizedDetails) {
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
      credentials: 'same-origin',
      body: JSON.stringify(details)
    })
      .then(response => response.json())
      .then((data: IAuthResponse) => {
        if (data.status) { throw new Error(data.message); }  
        cookie.save('bearer', data.token);
        dispatch(new SignupSuccess({ username: data.username, token: data.token }));
        dispatch(push('dashboard'));
      })
      .catch((error: Error) => {
        dispatch(new SignupFailure(error.message));
      });
  },
  
  loginUser: (details: IAuthDetails): ActionCreator => (dispatch, getState) => {
    axios.post('/auth/login', details)
      .then(response => {
        if (response.status !== 200) { throw new Error(); }
        return response;
      })
      .then((response) => {
        let data: IAuthResponse = (response as any).data;
        cookie.save('bearer', data.token);
        dispatch(new LoginUserSuccess({ username: data.username, token: data.token }));
        dispatch(push('dashboard'));
      })
      .catch((error: Error) => {
        dispatch(new LoginUserFailure('Invalid username or password'));
      });

    dispatch(new LoginUser(details));     
  },
  
  logoutUser: (): ActionCreator => (dispatch, getState) => {
    fetch('/auth/logout', { method: 'post' })
      .then(response => response.json())
      .then(() => { 
        cookie.remove('bearer');
        dispatch(new LogoutUserComplete());
      });
      
    dispatch(new LogoutUser());
  },
  
  loadUser: (details: ITokenizedDetails): ActionCreator => (dispatch, getState) => {
    dispatch(new LoadUser(details));
  }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const unloadedState: AuthState = { username: null, token: null, isAuthenticated: false, failureMessage: '' };
export const reducer: Reducer<AuthState> = (state, action) => {
    
  switch(action.type) {
    case SignupSuccess.prototype.type:
      return { username: (action as SignupSuccess).response.username, token: (action as SignupSuccess).response.token, isAuthenticated: true, failureMessage: state.failureMessage };
    case SignupFailure.prototype.type:
      return { username: state.username, token: state.token, isAuthenticated: false, failureMessage: (action as SignupFailure).message};
    case LoginUserSuccess.prototype.type:
      let response = (action as LoginUserSuccess).response;
      return { username: response.username, token: response.token, isAuthenticated: true, failureMessage: state.failureMessage };
    case LoginUserFailure.prototype.type:
      return { username: state.username, token: state.token, isAuthenticated: false, failureMessage: (action as LoginUserFailure).message};
    case LogoutUserComplete.prototype.type:
      return unloadedState;   
    case LoadUser.prototype.type:
      const { username, token } = (action as LoadUser).details;
      return { username, token, isAuthenticated: true, failureMessage: state.failureMessage };
  }

  // For unrecognized actions (or in cases where actions have no effect), must return the existing state
  // (or default initial state if none was supplied)
  return state || unloadedState;
};
