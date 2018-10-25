import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { registerUser } from './../../../actions/authActions';

// import classes from './Register.module.css';

import Navbar from './../../layout/Navbar/Navbar';

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    password2: '',
    errors: {}
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentWillReceiveProps = nextProps => {
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
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
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
                <div className={classnames('field', { error: errors.name })}>
                  <input
                    name="name"
                    type="text"
                    placeholder="Name"
                    value={this.state.name}
                    onChange={this.changeInputHandler}
                  />
                  {errors.name && <div className="ui pointing basic label">{errors.name}</div>}
                </div>
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
                <div className={classnames('field', { error: errors.password2 })}>
                  <input
                    name="password2"
                    type="password"
                    placeholder="Confirm Password"
                    value={this.state.password2}
                    onChange={this.changeInputHandler}
                  />
                  {errors.password2 && (
                    <div className="ui pointing basic label">{errors.password2}</div>
                  )}
                </div>
                <input type="submit" className="ui button" value="Sign Up" />
              </form>
              <div className="ui message">
                <p>Already have an account?</p>
                <p>
                  <Link to="/login">Sign in here!</Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="ui text container">
          <form noValidate onSubmit={this.submitFormHandler} className="ui fluid form">
            <div className={classnames('field', { error: errors.name })}>
              <input
                name="name"
                type="text"
                placeholder="Name"
                value={this.state.name}
                onChange={this.changeInputHandler}
              />
              {errors.name && <div className="ui pointing basic label">{errors.name}</div>}
            </div>
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
              {errors.password && <div className="ui pointing basic label">{errors.password}</div>}
            </div>
            <div className={classnames('field', { error: errors.password2 })}>
              <input
                name="password2"
                type="password"
                placeholder="Confirm Password"
                value={this.state.password2}
                onChange={this.changeInputHandler}
              />
              {errors.password2 && (
                <div className="ui pointing basic label">{errors.password2}</div>
              )}
            </div>
            <input type="submit" className="ui button" value="Sign Up" />
          </form>
        </div> */}
      </Fragment>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
