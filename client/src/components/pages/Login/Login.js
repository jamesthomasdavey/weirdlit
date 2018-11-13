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
    loading: false,
    errors: {}
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/browse');
    }
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/browse');
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
    document.title = 'Sign In | WeirdLit';
    const { errors } = this.state;
    return (
      <Fragment>
        <div className="ui text container">
          <div className="ui segment">
            <div className="ui one column stackable center aligned page grid">
              <div className="column nine wide">
                <form
                  noValidate
                  onSubmit={this.submitFormHandler}
                  className={[
                    'login__form ui fluid form',
                    this.state.loading ? 'loading' : ''
                  ].join(' ')}
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
