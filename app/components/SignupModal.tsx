import * as React from 'react';
import { reduxForm, ReduxFormProps } from 'redux-form';
import { Modal, Button } from 'react-bootstrap';
import { isEmail } from 'validator';

import { signup } from '../actions';

interface P extends ReduxFormProps {
  onHide(e?: React.SyntheticEvent): void;
  show: boolean;
  signup(props: any): Promise<any>;
}

class SignupModal extends React.Component<P, {}> {
    
  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object
  };
    
  context: {
    router: ReactRouter.RouterOnContext;
  };

  _onSubmit = (props) => {
    this.props.signup(props).then((result) => {
      this.props.onHide();
      if (result.payload.status === 200) {
        this.context.router.push('/dashboard'); 
      };
    });
  };
  
  _onClose = () => {
    this.props.resetForm();
    this.props.onHide();
  };

  render() {
    let { fields: { email, username, password, confirmPassword }, handleSubmit } = this.props;

    return (
      <Modal show={this.props.show} onHide={this._onClose}>
        <Modal.Header>
          <Modal.Title>Sign up</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form>
            <div className={ `form-group ${email.touched && email.invalid ? 'has-error' : ''}`} >
              <label className="control-label">Email</label>
              <input type="email" className="form-control" {...email} />
              <div className="help-block">
                {email.touched? email.error : ''}
              </div>
            </div>
            <div className={ `form-group ${username.touched && username.invalid ? 'has-error' : ''}`} >
              <label className="control-label">Username</label>
              <input type="text" className="form-control" {...username} />
              <div className="help-block">
                {username.touched? username.error : ''}
              </div>
            </div>
            <div className={ `form-group ${password.touched && password.invalid ? 'has-error' : ''}`} >
              <label className="control-label">Password</label>
              <input type="password" className="form-control" {...password} />
              <div className="help-block">
                {password.touched? password.error : ''}
              </div>
            </div>
            <div className={ `form-group ${confirmPassword.touched && confirmPassword.invalid ? 'has-error' : ''}`} >
              <label className="control-label">Confirm Password</label>
              <input type="password" className="form-control" {...confirmPassword} />
              <div className="help-block">
                {confirmPassword.touched ? confirmPassword.error : ''}
              </div>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this._onClose}>Close</Button>
          <Button onClick={handleSubmit(this._onSubmit.bind(this))} bsStyle="primary">Login</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

function validate({ email = '', username = '', password = '', confirmPassword = '' }) {
  const errors: any = {};
  const passRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

  if(!isEmail(email)) {
    errors.email = 'Please enter a valid email.';
  }

  if (!username.trim()) {
    errors.username = 'Please enter a username.';
  }

  if(!passRegex.test(password.trim())) {
    errors.password = 'A password must be a minimum 8 characters with at least 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Character.';
  }

  if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords are not matching.';
  }
    
  return errors;
}

export default reduxForm({
  form: 'SignupModalForm',
  fields: [ 'email', 'username', 'password', 'confirmPassword' ],
  validate
}, null, { signup })(SignupModal);