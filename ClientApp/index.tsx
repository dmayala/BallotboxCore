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

interface S {
    rehydrated: boolean;
}

const middleware = applyMiddleware(promise as any);
const store = compose(
    middleware
)(createStore)(reducers, {}, autoRehydrate());

class AppProvider extends React.Component<any, S> {

    state: S = { rehydrated: false };

    private componentWillMount(): void {
      persistStore(store, { storage: localForage, whitelist: ['auth'] }, () => {
        this.setState({ rehydrated: true })
      });
    }

    render() {
      if (!this.state.rehydrated) {
        return <div>Loading...</div>
      }
      return (
        <Provider store={store}>
          <Router history={hashHistory} routes={routes} />
        </Provider>
      );
    }
}

ReactDOM.render(
  <AppProvider />,
  document.getElementById('ballotbox'));