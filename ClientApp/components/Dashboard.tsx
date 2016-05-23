import * as React from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Button} from 'react-bootstrap';

interface P extends ReactRouter.RouteComponentProps<{}, {}> {
}

export default (props: P): React.ReactElement<any> => {
  return (
    <div className="container" id="content">
      <header id="banner" className="hero-unit">
        <div className="container">
          <h1>Dashboard</h1>
          <p className="lead">What would you like to do today?</p>
          <LinkContainer to="/dashboard/new">
            <Button bsStyle="success" bsSize="large">New Poll</Button>
          </LinkContainer>
          { ' ' }
          <LinkContainer to="/dashboard/polls">
            <Button bsStyle="primary" bsSize="large">My Polls</Button>
          </LinkContainer>
        </div>
      </header>
      <div className="col-lg-12">
        { props.children }
      </div>
    </div>
  ); 
}