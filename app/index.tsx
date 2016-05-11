import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { Router, hashHistory } from 'react-router';
import * as localForage from 'localforage';
import 'setimmediate';

import * as promise from 'redux-promise';
import { persistStore, autoRehydrate } from 'redux-persist';

import reducers from './reducers';
import routes from './routes';

const middleware = applyMiddleware(promise as any);
const store = compose(
    middleware
)(createStore)(reducers, {}, autoRehydrate());

persistStore(store, { storage: localForage, whitelist: [ 'auth' ] });

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory} routes={routes} />
    </Provider>
    , document.getElementById('ballotbox'));