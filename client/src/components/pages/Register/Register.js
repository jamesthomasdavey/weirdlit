import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from './../../../actions/authActions';

import './Register.css';

import Navbar from './../../layout/Navbar/Navbar';
import InputField from './../../layout/InputField/InputField';

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    password2: '',
    favoriteBook: '',
    errors: {}
  };

  componentDidMount = () => {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  };

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
              <form
                noValidate
                onSubmit={this.submitFormHandler}
                className="register__form ui fluid form"
              >
                <InputField
                  name="name"
                  placeholder="Name"
                  value={this.state.name}
                  onChange={this.changeInputHandler}
                  error={errors.name}
                />
                <InputField
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.changeInputHandler}
                  error={errors.email}
                />
                <InputField
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.changeInputHandler}
                  error={errors.password}
                />
                <InputField
                  name="password2"
                  type="password"
                  placeholder="Confirm Password"
                  value={this.state.password2}
                  onChange={this.changeInputHandler}
                  error={errors.password2}
                />
                <InputField
                  name="favoriteBook"
                  label="What is your favorite book?"
                  placeholder="Book Title (optional)"
                  value={this.state.favoriteBook}
                  onChange={this.changeInputHandler}
                  error={errors.favoriteBook}
                />
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
