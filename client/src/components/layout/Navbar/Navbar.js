import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from './../../../actions/authActions';

import './../../../img/bird-1903523.png';

import shellLogo from './../../../img/beach-1297237.svg';
import Search from './../Search/Search';

import './Navbar.css';

class Navbar extends Component {
  logoutHandler = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { isAuthenticated } = this.props.auth;

    const authLinks = (
      <div className="ui right simple dropdown item">
        <i className="user circle icon large" />
        <i className="dropdown icon" />
        <div className="menu">
          <Link to="/profile">
            <div className="item">Profile</div>
          </Link>
          <Link to="/dashboard">
            <div className="item">Dashboard</div>
          </Link>
          <div className="divider" />
          <Link to="/settings">
            <div className="item">Settings</div>
          </Link>
          <div className="item" onClick={this.logoutHandler}>
            Sign Out
          </div>
        </div>
      </div>
    );

    const guestLinks = (
      <div className="ui right simple dropdown item">
        <i className="user circle outline icon large" />
        <i className="dropdown icon" />
        <div className="menu">
          <Link to="/login">
            <div className="item">Sign In</div>
          </Link>
          <Link to="/register">
            <div className="item">Register</div>
          </Link>
        </div>
      </div>
    );

    const userLinks = isAuthenticated ? authLinks : guestLinks;

    return (
      <Fragment>
        <div className="navbar ui borderless stackable menu large">
          <div className="ui container">
            <Link to="/">
              <div className="header item">
                <img alt="logo" className="logo__icon" src={shellLogo} />
                <div className="logo__text">
                  <span className="logo__text_weird">Weird</span>
                  <span className="logo__text_lit">Lit</span>
                </div>
              </div>
            </Link>
            <Search />
            {!this.props.isAuthPage && userLinks}
          </div>
        </div>
      </Fragment>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);
