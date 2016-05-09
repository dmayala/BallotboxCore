import * as React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import AddPoll from './components/AddPoll';
import Login from './components/Login';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="dashboard" component={Dashboard}>
      <IndexRoute component={AddPoll as any} />
      <Route path="new" component={AddPoll as any} />
    </Route>
    <Route path="login" component={Login}></Route>
  </Route>
);
