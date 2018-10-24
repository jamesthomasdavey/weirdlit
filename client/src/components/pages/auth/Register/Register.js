import React, { Component } from 'react';
import classnames from 'classnames';
import classes from './Register.module.css';

import axios from 'axios';

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    password2: '',
    errors: {}
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
    axios
      .post('/api/users/register', newUser)
      .then(res => console.log(res.data))
      .catch(err => this.setState({ errors: err.response.data }));
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="ui text container">
        <form noValidate onSubmit={this.submitFormHandler} className="ui fluid form">
          <div className={classnames('field', { error: errors.name })}>
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={this.state.name}
              onChange={this.changeInputHandler}
              onBlur={this.removeErrorHandler}
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
              onBlur={this.removeErrorHandler}
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
              onBlur={this.removeErrorHandler}
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
              onBlur={this.removeErrorHandler}
            />
            {errors.password2 && <div className="ui pointing basic label">{errors.password2}</div>}
          </div>
          <input type="submit" className="ui button" />
        </form>
      </div>
    );
  }
}

export default Register;
