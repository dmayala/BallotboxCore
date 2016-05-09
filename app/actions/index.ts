import * as axios from 'axios';

export const ADD_POLL = 'ADD_POLL';
export const LOGIN_USER = 'LOGIN_USER';

export function addPoll(details) {
  const request = axios.post('/api/polls', details); 

  return {
    type: ADD_POLL,
    payload: request
  };
};

export function loginUser(details) {
  const request = axios.post('/auth/login', details); 

  return {
    type: LOGIN_USER,
    payload: request
  };
};