import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, browserHistory } from 'react-router';
import * as promise from 'redux-promise';

import reducers from './reducers';
import routes from './routes';

const createStoreWithMiddleware = applyMiddleware(promise as any)(createStore);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers) }>
        <Router history={browserHistory} routes={routes} />
    </Provider>
    , document.getElementById('ballotbox'));