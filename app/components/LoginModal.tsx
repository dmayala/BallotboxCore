import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Input, Button, Alert } from 'react-bootstrap';

import { loginUser } from '../actions';

interface ILoginDetails {
  username: string;
  password: string;
}

interface P {
  show: boolean;
  onHide(e?: React.SyntheticEvent): void;
  loginUser(details: ILoginDetails): Promise<any>;
}

interface S extends ILoginDetails {
  loginFailure: string;
}

class LoginModal extends React.Component<P, S> {
  
  refs: {
    [string: string]: any;
    loginForm: any;
  }

  state: S = this._getInitialState();
  
  private _getInitialState(): S {
    return {
      username: '',
      password: '',
      loginFailure: ''
    }
  }

  private _onSave = (e): void => {
    e.preventDefault();
    let { username, password } = this.state
    this.props.loginUser({ username, password }).then((result) => {
      if (result.payload.status === 200) {
        return this.props.onHide();
      }
      this._onFailedLogin();
    });
  };
  
  private _onFailedLogin = (): void => {
    this.setState(Object.assign({}, this.state, { 
      loginFailure: 'You have entered an invalid username or password.'
    }));
  };

  private _onChange = (e): void => {
    let state: S = Object.assign({}, this.state);
    state[e.target.name] = e.target.value; 
    this.setState(state);
  };
  
  private _onClose = (): void => {
    this.setState(this._getInitialState());
    this.refs.loginForm.reset();
    this.props.onHide();
  };

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header>
          <Modal.Title>Log in</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form ref="loginForm">
            {this.state.loginFailure ? (<Alert bsStyle="danger">
              { this.state.loginFailure }
            </Alert>) : null}
            <Input label="Username" name="username" type="text" value={this.state.username}
            onChange={this._onChange} /> 
            <Input label="Password" name="password" type="password" value={this.state.password}
            onChange={this._onChange} /> 
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this._onClose}>Close</Button>
          <Button onClick={this._onSave} bsStyle="primary">Login</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default LoginModal;