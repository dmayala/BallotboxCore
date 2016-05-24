import * as React from 'react';

import { provide } from 'redux-typed';
import { actionCreators } from '../store/Auth';

import {Input, Button, Alert} from 'react-bootstrap';

interface ILoginDetails {
  username: string;
  password: string;
}

interface S extends ILoginDetails {
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
    this.props.loginUser({ username, password });
    // .then((data) => {
    //   if (!data.error) {
    //     return this.context.router.push('/');
    //   }
      
    //   let state = Object.assign({}, this.state);
    //   state.success = false;
    //   this.setState(state);
    // });
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

// Selects which part of global state maps to this component, and defines a type for the resulting props
const provider = provide(
    null,
    actionCreators
);
type P = typeof provider.allProps;
export default provider.connect(Login);

//export default connect(null, { loginUser })(Login);
