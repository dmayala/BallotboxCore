import * as React from 'react';
import {Link} from 'react-router';
import {LinkContainer} from 'react-router-bootstrap';
import {Navbar, Nav, DropdownButton, MenuItem, NavItem} from 'react-bootstrap';

import { provide } from 'redux-typed';
import { ApplicationState }  from '../store';
import { actionCreators } from '../store/Auth';

import LoginModal from '../components/LoginModal';
import SignupModal from '../components/SignupModal';

interface S {
    showLoginModal: boolean;
    showSignupModal: boolean;
}

class Header extends React.Component<P, S> {
  
  static contextTypes: React.ValidationMap<any> = {
		router: React.PropTypes.object
	};
  
  context: {
    router: ReactRouter.RouterOnContext;
  };
  
  state = this._getState();
  
  private _getState(): S {
    return {
      showLoginModal: false,
      showSignupModal: false
    };
  }

  private toggleSignup = (e: React.SyntheticEvent): void => {
    this.setState(Object.assign(this.state, { showSignupModal: !this.state.showSignupModal }));
  };

  private toggleLogin = (e: React.SyntheticEvent): void => {
    this.setState(Object.assign(this.state, { showLoginModal: !this.state.showLoginModal }));
  };
  
  private _onLogout = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };
  
  private _loggedInNav = () => {
      return [
        (<LinkContainer key={1} to="dashboard">
          <NavItem eventKey={1}>Dashboard</NavItem>
        </LinkContainer>),
        (<NavItem href="/" key={2} eventKey={2} onClick={this._onLogout}>Log Out</NavItem>),
      ];
  };

  render(): React.ReactElement<any> {
    const props = Object.assign({}, this.state, this.props);
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Ballotbox</Link> 
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse eventKey={0}>
          <Nav navbar>
          </Nav>
          <Nav navbar pullRight>
           { !this.props.isAuthenticated ? 
              [(<NavItem key={1} eventKey={1} href="#" onSelect={this.toggleSignup}>Sign up</NavItem>),
              (<NavItem key={2} eventKey={2} href="#" onSelect={this.toggleLogin}>Login</NavItem>)] :
              this._loggedInNav()
           }
          </Nav>
          <Nav navbar pullRight>
          </Nav>
        </Navbar.Collapse>    
        <LoginModal {...props} show={this.state.showLoginModal} onHide={this.toggleLogin} loginUser={this.props.loginUser}/> 
        <SignupModal {...props} show={this.state.showSignupModal} onHide={this.toggleSignup} />  
      </Navbar>
    );
  }
}

function mapStateToProps(state: ApplicationState) {
  return {
    user: state.auth.username,
    isAuthenticated: state.auth.isAuthenticated
  };
}

// Selects which part of global state maps to this component, and defines a type for the resulting props
const provider = provide(
    mapStateToProps,
    actionCreators
);
type P = typeof provider.allProps;
export default provider.connect(Header);