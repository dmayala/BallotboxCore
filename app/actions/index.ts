import * as axios from 'axios';

export const FETCH_POLLS = 'FETCH_POLLS';
export const FETCH_POLL = 'FETCH_POLL';
export const ADD_POLL = 'ADD_POLL';
export const REMOVE_POLL = 'REMOVE_POLL';

export const VOTE = 'VOTE';

export const SIGNUP = 'SIGNUP';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const LOAD_USER = 'LOAD_USER';

export function vote(pollId: number, choiceId: number) {
  // todo
  console.log(`pollId: ${pollId} and choiceId: ${choiceId}`);
}

export function fetchPolls(username: string) {
  const request = axios.get(`/api/polls/user/${username}`); 

  return {
    type: FETCH_POLLS,
    payload: request
  };
};

export function fetchPoll(pollId: number) {
  const request = axios.get(`/api/polls/${pollId}`); 

  return {
    type: FETCH_POLL,
    payload: request
  };
};

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
};

export function signup(details) {
  const request = axios.post('/auth/register', details);

  return {
    type: SIGNUP,
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

export function logoutUser() {
  const request = axios.post('/auth/logout'); 

  return {
    type: LOGOUT_USER,
    payload: request
  };
};

export function loadUser(username) {
  return {
    type: LOAD_USER,
    payload: { username }
  };
};
