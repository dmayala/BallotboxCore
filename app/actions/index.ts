import * as axios from 'axios';

export const ADD_POLL = 'ADD_POLL';

export function addPoll(details) {
  const request = axios.post('/api/poll', details); 

  return {
    type: ADD_POLL,
    payload: request
  };
};