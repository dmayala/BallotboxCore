import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './reducer_auth';
import pollsReducer from './reducer_polls';

const rootReducer = combineReducers({
    auth: authReducer,
    form: formReducer,
    polls: pollsReducer
});

export default rootReducer;