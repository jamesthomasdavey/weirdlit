import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCurrentProfile, clearCurrentProfile } from './../../../actions/profileActions';
import axios from 'axios';
import { logoutUser, loginUser } from './../../../actions/authActions';
import isEmpty from './../../../validation/is-empty';

import TextInputField from './../../layout/TextInputField/TextInputField';
import Navbar from './../../layout/Navbar/Navbar';

class Account extends Component {
  state = {
    name: '',
    email: '',
    oldEmail: '',
    newPassword: '',
    newPassword2: '',
    oldPassword: '',
    hasChanged: false,
    hasSaved: false,
    formLoading: false,
    errors: {}
  };
  componentWillReceiveProps = nextProps => {
    if (nextProps.profile.profile) {
      this.setState({
        email: nextProps.profile.profile.user.email,
        oldEmail: nextProps.profile.profile.user.email,
        name: nextProps.profile.profile.user.name
      });
    }
  };
  componentDidMount = () => {
    this.props.getCurrentProfile();
  };
  changeInputHandler = e => {
    const target = e.target;
    this.setState({ [target.name]: e.target.value }, () => {
      if (target.name !== 'oldPassword') {
        this.setState({ hasChanged: true, hasSaved: false });
      }
    });
  };
  formSubmitHandler = e => {
    e.preventDefault();
    this.setState({ formLoading: true }, () => {
      axios
        .put('/api/users', {
          name: this.state.name,
          email: this.state.email,
          newPassword: this.state.newPassword,
          newPassword2: this.state.newPassword2,
          oldPassword: this.state.oldPassword
        })
        .then(res => {
          this.setState({ formLoading: false }, () => {
            if (!isEmpty(res.data.errors)) {
              this.setState({ errors: res.data.errors });
            } else if (this.state.email !== this.state.oldEmail || this.state.newPassword !== '') {
              this.props.clearCurrentProfile();
              this.props.logoutUser();
            } else {
              const prevState = this.state;
              this.props.loginUser(
                {
                  email: prevState.email,
                  password: prevState.newPassword || prevState.oldPassword
                },
                () => {
                  this.props.getCurrentProfile(() => {
                    this.setState({
                      hasChanged: false,
                      hasSaved: true,
                      errors: {},
                      newPassword: '',
                      newPassword2: '',
                      oldPassword: '',
                      oldEmail: prevState.email
                    });
                  });
                }
              );
            }
          });
        });
    });
  };
  render() {
    const { profile, loading } = this.props.profile;

    let dashboardContent;
    const date = (
      <span>
        {profile &&
          new Date(this.props.profile.profile.date).toLocaleString('en-us', { month: 'long' })}{' '}
        {profile && new Date(this.props.profile.profile.date).getFullYear()}
      </span>
    );
    dashboardContent = (
      <Fragment>
        <div style={{ paddingBottom: '24px' }}>
          <h2>{this.state.name}</h2>
          {profile && <small>User since {date}</small>}
        </div>
        <form
          noValidate
          onSubmit={this.formSubmitHandler}
          className={['ui form', this.state.formLoading || loading ? 'loading' : ''].join(' ')}
          style={{ marginBottom: '1rem' }}
        >
          <TextInputField
            label="Name"
            name="name"
            type="text"
            maxLength="40"
            error={this.state.errors.name}
            value={this.state.name}
            onChange={this.changeInputHandler}
          />
          <TextInputField
            label="Email"
            name="email"
            type="email"
            error={this.state.errors.email}
            value={this.state.email}
            onChange={this.changeInputHandler}
          />
          <TextInputField
            label="New Password"
            name="newPassword"
            type="password"
            maxLength="30"
            error={this.state.errors.newPassword}
            value={this.state.newPassword}
            onChange={this.changeInputHandler}
          />
          <TextInputField
            label="Confirm New Password"
            name="newPassword2"
            type="password"
            maxLength="30"
            error={this.state.errors.newPassword2}
            value={this.state.newPassword2}
            onChange={this.changeInputHandler}
          />
          <TextInputField
            label="Current Password *"
            name="oldPassword"
            type="password"
            placeholder="Please enter your previous password before confirming any changes."
            error={this.state.errors.oldPassword}
            value={this.state.oldPassword}
            onChange={this.changeInputHandler}
          />
          <input
            type="submit"
            className={['ui button primary', this.state.hasChanged ? '' : 'disabled'].join(' ')}
            value={this.state.hasSaved ? 'Saved' : 'Save'}
          />
          <Link to="/account/delete" style={{ marginLeft: '1rem' }} className="ui negative button">
            Delete Account
          </Link>
        </form>
        <small>You will be asked to sign back in after changing your email or password.</small>
      </Fragment>
    );

    document.title = 'Account | WeirdLit';
    return (
      <Fragment>
        <Navbar />
        <div className="ui container">
          <div className="ui text container">{dashboardContent}</div>
        </div>
      </Fragment>
    );
  }
}

Account.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  clearCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, logoutUser, loginUser, clearCurrentProfile }
)(Account);
