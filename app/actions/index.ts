import * as axios from 'axios';

export const FETCH_POLLS = 'FETCH_POLLS';
export const ADD_POLL = 'ADD_POLL';
export const REMOVE_POLL = 'REMOVE_POLL';

export const SIGNUP = 'SIGNUP';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';


export function fetchPolls(username: string) {
  const request = axios.get(`/api/polls/${username}`); 

  return {
    type: FETCH_POLLS,
    payload: request
  };
}

export function addPoll(details) {
  const request = axios.post('/api/polls', details); 

  return {
    type: ADD_POLL,
    payload: request
  };
};

export function removePoll(id: number) {
  const request = axios.delete(`/api/polls/${id}`); 
  
  return {
    type: REMOVE_POLL,
    payload: request
  };
}

export function signup(details) {
  // todo - add signup method to controller
  console.log(details);
}

export function loginUser(details) {
  const request = axios.post('/auth/login', details); 

  return {
    type: LOGIN_USER,
    payload: request
  };
};

export function logoutUser() {
  const request = axios.post('/auth/logout'); 

  return {
    type: LOGOUT_USER,
    payload: request
  };
}


