// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

// action
import { loginUser, logoutUser } from '../../../actions/authActions';

// validation
import isEmpty from '../../../validation/is-empty';

// component
import Navbar from '../../layout/Navbar/Navbar';
import TextInputField from '../../layout/TextInputField/TextInputField';

class Account extends Component {
  state = {
    form: {
      name: '',
      email: '',
      newPassword: '',
      newPassword2: '',
      oldPassword: ''
    },
    date: '',
    isLoading: true,
    isSaving: false,
    hasChanged: false,
    hasSaved: false,
    errors: {}
  };
  componentDidMount = () => {
    this.updateFromProfile();
  };
  updateFromProfile = () => {
    axios.get('api/profile').then(res => {
      const currentState = this.state;
      currentState.date = res.data.date;
      currentState.form.name = res.data.user.name;
      currentState.form.email = res.data.user.email;
      currentState.isLoading = false;
      this.setState(currentState);
    });
  };
  changeInputHandler = e => {
    const currentState = this.state;
    currentState.form[e.target.name] = e.target.value;
    if (e.target.name !== 'oldPassword') {
      currentState.hasChanged = true;
    }
    this.setState(currentState);
  };
  formSubmitHandler = e => {
    e && e.preventDefault();
    const updatedUser = this.state.form;
    this.setState({ isLoading: true }, () => {
      axios.put('/api/users', updatedUser).then(res => {
        if (!isEmpty(res.data.errors)) {
          this.setState({ errors: res.data.errors, isLoading: false });
        } else {
          const currentState = this.state;
          this.props.loginUser(
            {
              email: currentState.form.email,
              password: currentState.form.newPassword || currentState.form.oldPassword
            },
            () => {
              const currentState = this.state;
              currentState.hasSaved = true;
              currentState.hasChanged = false;
              currentState.form.newPassword = '';
              currentState.form.newPassword2 = '';
              currentState.form.oldPassword = '';
              this.setState(currentState, this.updateFromProfile);
            }
          );
        }
      });
    });
  };
  render() {
    let userSince;
    if (this.state.date) {
      const date = new Date(this.state.date);
      userSince = (
        <span>
          User since {date.toLocaleString('en-us', { month: 'long' })} {date.getFullYear()}
        </span>
      );
    }

    return (
      <Fragment>
        <Navbar />
        <div className="ui container">
          <div className="ui text container">
            <form
              noValidate
              className={['ui form', this.state.isLoading ? 'loading' : ''].join(' ')}
              onSubmit={this.formSubmitHandler}
            >
              {' '}
              <div style={{ paddingBottom: '20px' }}>
                <h2>{this.state.form.name}</h2>
                {userSince}
              </div>
              <TextInputField
                label="Name"
                name="name"
                type="text"
                maxLength="40"
                error={this.state.errors.name}
                value={this.state.form.name}
                onChange={this.changeInputHandler}
              />
              <TextInputField
                label="Email"
                name="email"
                type="email"
                error={this.state.errors.email}
                value={this.state.form.email}
                onChange={this.changeInputHandler}
              />
              <TextInputField
                label="New Password"
                name="newPassword"
                type="password"
                maxLength="30"
                error={this.state.errors.newPassword}
                value={this.state.form.newPassword}
                onChange={this.changeInputHandler}
              />
              <TextInputField
                label="Confirm New Password"
                name="newPassword2"
                type="password"
                maxLength="30"
                error={this.state.errors.newPassword2}
                value={this.state.form.newPassword2}
                onChange={this.changeInputHandler}
              />
              <TextInputField
                label="Current Password *"
                name="oldPassword"
                type="password"
                placeholder="Please enter your previous password before confirming any changes."
                error={this.state.errors.oldPassword}
                value={this.state.form.oldPassword}
                onChange={this.changeInputHandler}
              />
              <input
                type="submit"
                className={['ui button primary', this.state.hasChanged ? '' : 'disabled'].join(' ')}
                value={this.state.hasSaved ? 'Saved' : 'Save'}
              />
              <Link
                to="/account/delete"
                style={{ marginLeft: '1rem' }}
                className="ui negative button"
              >
                Delete Account
              </Link>
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}

Account.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { loginUser, logoutUser }
)(Account);
