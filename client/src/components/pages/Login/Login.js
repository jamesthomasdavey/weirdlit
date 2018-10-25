import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { loginUser } from './../../../actions/authActions';

import Navbar from './../../layout/Navbar/Navbar';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: {}
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps = nextProps => {
    console.log(nextProps);
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
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
    const { errors } = this.state;
    return (
      <Fragment>
        <Navbar isAuthPage={true} />
        <div className="ui container">
          <div className="ui one column stackable center aligned page grid">
            <div className="column nine wide">
              <form noValidate onSubmit={this.submitFormHandler} className="ui fluid form">
                <div className={classnames('field', { error: errors.email })}>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.changeInputHandler}
                  />
                  {errors.email && <div className="ui pointing basic label">{errors.email}</div>}
                </div>
                <div className={classnames('field', { error: errors.password })}>
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.changeInputHandler}
                  />
                  {errors.password && (
                    <div className="ui pointing basic label">{errors.password}</div>
                  )}
                </div>
                <input type="submit" className="ui button" value="Sign In" />
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
