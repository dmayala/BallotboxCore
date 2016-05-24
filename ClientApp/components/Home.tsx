import * as React from 'react';
import {Button} from 'react-bootstrap';
import SignupModal from './SignupModal';

declare var process:any;
if (process.env['BROWSER']) {
  require('stylesheets/components/_Home');
}

export default class Home extends React.Component<any, any> {
    
  state = this._getState();
  
  private _getState() {
    return { showSignupModal: false };
  }

  private toggleSignup = (e: React.SyntheticEvent): void => {
    this.setState({ showSignupModal: !this.state.showSignupModal });
  };
  
  render () {
    return (
      <div className="container" id="content">
        <header id="banner" className="hero-unit">
          <div className="container">
            <div><h1>Ballotbox</h1>
              <p className="lead">Create custom polls with live results.</p>
              <Button onClick={this.toggleSignup} bsStyle="success" bsSize="large">Sign up</Button>
            </div>
          </div>
        </header>
        <div className="col-lg-12 home">
          <div className="col-lg-6">
            <i className="fa fa-bolt"></i>
            <h2>Live Results</h2>
            <p>Live graphs show your poll results immediately in an easy to understand format. One graph will not provide the whole picture, that's why we provide multiple graph types to better describe your results.</p>
          </div>
          <div className="col-lg-6">
            <i className="fa fa-globe"></i>
            <h2>Works Everywhere</h2>
            <p>Traditional desktop computers now represent only 30% of Internet traffic. Your poll must work on the tablets, smart phones, netbooks and notebooks that your visitors are using. Our responsive designs do just that.</p>
          </div>
        </div>
        <SignupModal show={this.state.showSignupModal} onHide={this.toggleSignup} />  
      </div>
    );
  }
}