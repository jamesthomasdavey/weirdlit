// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Modal as SemanticModal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { loginUser } from './../../../../../actions/authActions';

// component
import TextInputField from './../../../TextInputField/TextInputField';

// css
import classes from './LoginForm.module.css';

class LoginForm extends Component {
  state = {
    email: '',
    password: '',
    loading: false,
    errors: {}
  };
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.closeModalHandler();
    }
  }
  componentWillReceiveProps = nextProps => {
    if (nextProps.auth.isAuthenticated) {
      this.props.closeModalHandler();
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors, loading: false });
    }
  };
  changeInputHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  submitFormHandler = e => {
    e.preventDefault();
    this.setState({ loading: true }, () => {
      const userData = {
        email: this.state.email,
        password: this.state.password
      };
      this.props.loginUser(userData);
    });
  };
  render() {
    return (
      <Fragment>
        <SemanticModal.Header>Sign In</SemanticModal.Header>
        <SemanticModal.Content>
          <form
            noValidate
            onSubmit={this.submitFormHandler}
            className={['ui form', this.state.loading ? 'loading' : ''].join(' ')}
          >
            <TextInputField
              name="email"
              type="email"
              placeholder="Email"
              autoFocus={true}
              value={this.state.email}
              onChange={this.changeInputHandler}
              error={this.state.errors.email}
            />
            <TextInputField
              name="password"
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={this.changeInputHandler}
              error={this.state.errors.password}
            />
            <input
              style={{ display: 'block', margin: '0 auto' }}
              type="submit"
              className="ui grey button"
              value="Sign In"
            />
          </form>
          <div className="ui message" style={{ textAlign: 'center' }}>
            <p>Don't have an account?</p>
            <p>
              <span className={classes.switchLink} onClick={this.props.switchFormTypeHandler}>
                Create one now!
              </span>
            </p>
          </div>
        </SemanticModal.Content>
      </Fragment>
    );
  }
}

LoginForm.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  closeModalHandler: PropTypes.func.isRequired,
  switchFormTypeHandler: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(LoginForm);
