import * as React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import RequireAuth from './containers/RequireAuth';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Poll from './containers/Poll';
import AddPoll from './containers/AddPoll';
import MyPolls from './containers/MyPolls';
import Login from './containers/Login';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="dashboard" component={RequireAuth(Dashboard)}>
      <IndexRoute component={AddPoll as any} />
      <Route path="new" component={AddPoll as any} />
      <Route path="polls" component={MyPolls} />
    </Route>
    <Route path="polls/:id" component={Poll} />
    <Route path="login" component={Login}></Route>
  </Route>
);
