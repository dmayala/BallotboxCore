import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, Input, Button } from 'react-bootstrap';

import { loginUser } from '../actions';


interface P extends JSX.IntrinsicClassAttributes<React.HTMLProps<HTMLDivElement>> {
    show: boolean;
    onHide: Function;
    loginUser?: Function;
}

interface S {
    username: string;
    password: string;
}

class LoginModal extends React.Component<P, S> {

  state = {
    username: '',
    password: ''
  };

  _onSave = (e) => {
    e.preventDefault();
    this.props.loginUser(this.state).then(() => {
      this.props.onHide();
    });
  };

  _onChange = (e) => {
    let state = Object.assign({}, this.state);
    state[e.target.name] = e.target.value; 
    this.setState(state);
  };

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header>
          <Modal.Title>Log in</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form ref="loginForm">
            <Input label="Username" name="username" type="text" value={this.state.username}
            onChange={this._onChange} /> 
            <Input label="Password" name="password" type="password" value={this.state.password}
            onChange={this._onChange} /> 
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
          <Button onClick={this._onSave} bsStyle="primary">Login</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default LoginModal;