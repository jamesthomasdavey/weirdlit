// packages
import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from './../../../actions/authActions';
import { clearCurrentProfile } from './../../../actions/profileActions';

//images
import './../../../img/bird-1903523.png';

// components
import shellLogo from './../../../img/beach-1297237.svg';
import Search from './../Search/Search';

// css
import './Navbar.css';

class Navbar extends Component {
  logoutHandler = () => {
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <div className="ui right simple dropdown item">
        <i className="user circle icon large" />
        <i className="dropdown icon" />
        <div className="menu">
          <Link to="/profile">
            <div className="item profile__item-link">
              <span className="menu__item-link">{user.name ? user.name : 'Profile'}</span>
            </div>
          </Link>
          <div className="divider" />
          <div className="header">{'Account'.toUpperCase()}</div>
          <Link to="/account">
            <div className="item profile__item-link">
              <span className="menu__item-link">Settings</span>
            </div>
          </Link>
          <div className="item profile__item-link" onClick={this.logoutHandler}>
            <span className="menu__item-link">Sign Out</span>
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
            <div className="item profile__item-link">
              <span className="menu__item-link">Sign In</span>
            </div>
          </Link>
          <Link to="/register">
            <div className="item profile__item-link">
              <span className="menu__item-link">Register</span>
            </div>
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
  { logoutUser, clearCurrentProfile }
)(Navbar);
