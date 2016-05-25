import * as React from 'react';

import { provide } from 'redux-typed';
import { ApplicationState }  from '../store';

import { Modal, Input, Button, Alert } from 'react-bootstrap';

interface S {
  username: string;
  password: string;
  loginRequested: boolean;
}

class LoginModal extends React.Component<P, S> {
  
  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object
  };
  
  context: {
    router: ReactRouter.RouterOnContext;
  };
  
  refs: {
    [string: string]: any;
    loginForm: any;
  }

  state: S = this._getInitialState();
  
  componentWillReceiveProps(nextProps) {
    if (this.state.loginRequested && nextProps.isAuthenticated) {
      this._onClose();
    }
  }
  
  private _getInitialState(): S {
    return {
      username: '',
      password: '',
      loginRequested: false
    }
  }
  
  private _onSave = (e): void => {
    e.preventDefault();
    this.setState(Object.assign({}, this.state, { loginRequested: true }));
    let { username, password } = this.state
    this.props.loginUser({ username, password });
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
            {this.state.loginRequested && this.props.loginFailure ? (<Alert bsStyle="danger">
              { this.props.loginFailure }
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

function mapStateToProps(state: ApplicationState) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    loginFailure: state.auth.failureMessage
  };
}

// Selects which part of global state maps to this component, and defines a type for the resulting props
const provider = provide(
    mapStateToProps,
    null
).withExternalProps<{
  show: boolean;
  onHide(e?: React.SyntheticEvent): void;
  loginUser(details: any): any;
}>();
type P = typeof provider.allProps;
export default provider.connect(LoginModal);