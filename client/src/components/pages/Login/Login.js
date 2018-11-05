import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from './../../../actions/authActions';

// component
import TextInputField from '../../layout/TextInputField/TextInputField';

import './Login.css';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: {}
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/');
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  };

  changeInputHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  removeErrorHandler = e => {
    const { errors } = this.state;
    errors[e.target.name] = '';
    this.setState({ errors });
  };

  submitFormHandler = e => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData);
  };

  render() {
    document.title = 'Sign In | WeirdLit';
    const { errors } = this.state;
    return (
      <Fragment>
        <div className="ui container">
          <div className="ui one column stackable center aligned page grid">
            <div className="column nine wide">
              <form
                noValidate
                onSubmit={this.submitFormHandler}
                className="login__form ui fluid form"
              >
                <TextInputField
                  name="email"
                  type="email"
                  placeholder="Email"
                  autoFocus={true}
                  value={this.state.email}
                  onChange={this.changeInputHandler}
                  error={errors.email}
                />
                <TextInputField
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.changeInputHandler}
                  error={errors.password}
                />
                <input type="submit" className="ui grey button" value="Sign In" />
              </form>
              <div className="ui message">
                <p>Don't have an account?</p>
                <p>
                  <Link to="/register">Create one now!</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
