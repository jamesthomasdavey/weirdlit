// packages
import React, { Fragment, Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from './../../../actions/authActions';
import axios from 'axios';

//images
import './../../../img/bird-1903523.png';

// components
import shellLogo from './../../../img/beach-1297237.svg';
import Search from './../Search/Search';
import Modal from './../Modal/Modal';

// css
import './Navbar.css';

class Navbar extends Component {
  state = {
    notificationsCount: 0,
    modal: ''
  };

  componentDidMount = () => {
    this.getNotificationsCount();
  };

  // componentDidUpdate = () => {
  // this.getNotificationsCount();
  // };

  getNotificationsCount = () => {
    if (this.props.auth.isAuthenticated) {
      axios.get('/api/users/notifications/count').then(res => {
        this.setState({ notificationsCount: res.data.notificationsCount });
      });
    }
  };

  logoutHandler = () => {
    this.props.logoutUser();
  };

  render() {
    const authLinks = (
      <div className="ui right simple dropdown item">
        <i
          className={[
            'icon large',
            this.state.loggingOut ? 'circle notch loading' : 'user circle'
          ].join(' ')}
        />
        <i className="dropdown icon" />
        <div className="menu" style={{ zIndex: '999' }}>
          <Link to="/profile/">
            <div className="item profile__item-link">
              <span className="menu__item-link">
                {this.props.auth.user.name ? this.props.auth.user.name : 'Profile'}
              </span>
            </div>
          </Link>{' '}
          <Link to="/notifications">
            <div className="item profile__item-link">
              <span className="menu__item-link">
                Notifications
                {this.state.notificationsCount > 0 && ` (${this.state.notificationsCount})`}
              </span>
            </div>
          </Link>
          {this.props.auth.user.isAdmin && (
            <Link to="/books/pending">
              <div className="item profile__item-link">
                <span className="menu__item-link">Pending Books</span>
              </div>
            </Link>
          )}
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
        <div className="menu" style={{ zIndex: '999' }}>
          <div
            onClick={() => this.setState({ modal: 'login' })}
            className="item profile__item-link"
          >
            <span className="menu__item-link">Sign In</span>
          </div>
          <div
            onClick={() => this.setState({ modal: 'register' })}
            className="item profile__item-link"
          >
            <span className="menu__item-link">Register</span>
          </div>
        </div>
      </div>
    );

    const userLinks = this.props.auth.isAuthenticated ? authLinks : guestLinks;

    return (
      <Fragment>
        <Modal formType={this.state.modal} hideModal={() => this.setState({ modal: '' })} />
        <div
          className="navbar ui borderless stackable menu large"
          style={{ position: 'relative', zIndex: '999' }}
        >
          <div className="ui container">
            <Link to="/">
              <div className="header item">
                <img alt="navbar_logo" className="logo__icon" src={shellLogo} />
                <div className="logo__text">
                  <span className="logo__text_weird">Weird</span>
                  <span className="logo__text_lit">Lit</span>
                </div>
              </div>
            </Link>
            <Search navBar history={this.props.history} />
            {userLinks}
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
)(withRouter(Navbar));
