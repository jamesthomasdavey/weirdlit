// package
import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import isEmpty from './../../../validation/is-empty';
import { logoutUser } from './../../../actions/authActions';
import PropTypes from 'prop-types';

// component
import TextInputField from './../../layout/TextInputField/TextInputField';

class DeleteAccount extends Component {
  state = {
    password: '',
    errors: {}
  };
  changeInputHandler = e => {
    const value = e.target.value;
    this.setState({ password: value });
  };
  formSubmitHandler = e => {
    e.preventDefault();
    axios.post('/api/users/delete', { password: this.state.password }).then(res => {
      if (!isEmpty(res.data.errors)) {
        this.setState({ errors: res.data.errors });
      } else {
        this.props.logoutUser();
      }
    });
  };
  render() {
    return (
      <Fragment>
        <div className="ui container">
          <div className="ui text container">
            <h1>Delete Account</h1>
            <h3>Are you sure? This cannot be undone.</h3>
            <form onSubmit={this.formSubmitHandler} className="ui form">
              <TextInputField
                label="Please re-enter your password to delete your account:"
                value={this.state.password}
                onChange={this.changeInputHandler}
                type="password"
                name="password"
                error={this.state.errors.password}
              />
              <input
                type="submit"
                className={['button negative ui', this.state.password ? '' : 'disabled'].join(' ')}
                value="Delete My Account"
              />
              <Link to="/account" className="button ui" style={{ marginLeft: '1rem' }}>
                Cancel
              </Link>
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}

DeleteAccount.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(DeleteAccount);
