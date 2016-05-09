import * as React from 'react';
import { connect } from 'react-redux';
import {Input, Button, Alert} from 'react-bootstrap';

import { loginUser } from '../actions';

interface P {    
    loginUser: Function;
}

interface S {
    username: string;
    password: string;
    success: boolean;
}

class Login extends React.Component<P, S> {
  
  static contextTypes: React.ValidationMap<any> = {
		router: React.PropTypes.object
	};
  
  context: {
    router: ReactRouter.RouterOnContext;
  };
  
  state = {
    username: '',
    password: '',
    success: null
  };

  _onLogin = (e) => {
    e.preventDefault();
    let { username, password } = this.state;
    this.props.loginUser({ username, password }).then((data) => {
      if (!data.error) {
        return this.context.router.push('/');
      }
      
      let state = Object.assign({}, this.state);
      state.success = false;
      this.setState(state);
    });
  };

  _onChange = (e): void => {
    let state = Object.assign({}, this.state);
    state[e.target.name] = e.target.value; 
    this.setState(state);
  };

  render(): React.ReactElement<any> {
    return (
      <div className="container">
        <h2>Log In</h2>
        { this.state.success === false ? (
          <Alert bsStyle="danger">
            <strong>Error!</strong> Username or Password are incorrect!
          </Alert>
          ) : null}
        <form ref="loginForm">
          <Input label="Username" name="username" type="text" value={this.state.username}
          onChange={this._onChange} /> 
          <Input label="Password" name="password" type="password" value={this.state.password}
          onChange={this._onChange} /> 
        </form>
        <Button onClick={this._onLogin}>Login</Button>
      </div>
    );
  }
}

export default connect(null, { loginUser })(Login);
