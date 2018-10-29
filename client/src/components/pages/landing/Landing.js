import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Search from './../../layout/Search/Search';

import './Landing.css';

class Landing extends Component {
  render() {
    document.title = 'WeirdLit | The Database for Strange Writings';
    const { isAuthenticated } = this.props.auth;
    let authButtons;
    if (!isAuthenticated) {
      authButtons = (
        <div className="ui internally celled grid">
          <div className="row">
            <div className="eight wide column">
              <Link to="/login">
                <button className="ui right floated grey button">Sign In</button>
              </Link>
            </div>
            <div className="eight wide column">
              <Link to="/register">
                <button className="ui left floated grey button">Register</button>
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return (
      <Fragment>
        <div className="landing">
          <div className="ui text container landing__container">
            <div className="landing__content">
              <div className="landing__content-inner">
                <div className="landing__content-logo">
                  <Link to="/browse">
                    <span className="landing__content-logo-text text__weird">Weird</span>
                    <span className="landing__content-logo-text text__lit">Li</span>
                  </Link>
                </div>
                <div className="landing__content-search">
                  <Search />
                </div>
                {authButtons}
              </div>
            </div>
          </div>
          <div className="background__animation" />
        </div>
      </Fragment>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);
