import * as axios from 'axios';

export const ADD_POLL = 'ADD_POLL';
export const FETCH_POLLS = 'FETCH_POLLS';

export const LOGIN_USER = 'LOGIN_USER';

export function fetchPolls() {
  
  return {
    type: FETCH_POLLS,
    payload: { data: null }
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
  
}


export function loginUser(details) {
  const request = axios.post('/auth/login', details); 

  return {
    type: LOGIN_USER,
    payload: request
  };
};

