import React, { Component } from 'react';
import classes from './Login.module.css';

class Register extends Component {
  state = {
    email: '',
    password: '',
    errors: {}
  };

  changeInputHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitFormHandler = e => {
    e.preventDefault();
    const user = {
      email: this.state.email,
      password: this.state.password
    };
    console.log(user);
  };

  render() {
    return (
      <div className={classes.register}>
        <form noValidate onSubmit={this.submitFormHandler}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.changeInputHandler}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.changeInputHandler}
          />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default Register;
