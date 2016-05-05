import * as React from 'react';
import {Link} from 'react-router';
import {Navbar, Nav, DropdownButton, MenuItem, NavItem} from 'react-bootstrap';
//import SignupModal from 'components/SignupModal';
//import LoginModal from 'components/LoginModal';

interface S {
    showLoginModal: boolean;
    showSignupModal: boolean;
}

class Header extends React.Component<{}, S> {

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
            <NavItem key={1} eventKey={1} href="#" onSelect={this.toggleSignup}>Sign up</NavItem>
            <NavItem key={2} eventKey={2} href="#" onSelect={this.toggleLogin}>Login</NavItem>
          </Nav>
          <Nav navbar pullRight>
          </Nav>
        </Navbar.Collapse>        
      </Navbar>
    );
  }
}

export default Header;
