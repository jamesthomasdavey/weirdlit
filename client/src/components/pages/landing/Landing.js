import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Search from './../../layout/Search/Search';

import './Landing.css';

class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }
  render() {
    return (
      <Fragment>
        <div className="ui text container landing__container">
          <div className="landing__content">
            <div className="landing__content-inner">
              <div className="landing__content-logo">
                <Link to="/dashboard">
                  <span className="landing__content-logo-text text__weird">Weird</span>
                  <span className="landing__content-logo-text text__lit">Lit</span>
                </Link>
              </div>
              <div className="landing__content-search">
                <Search />
              </div>
              <div className="ui internally celled grid">
                <div className="row">
                  <div className="eight wide column">
                    <Link to="/login">
                      <button className="ui right floated primary button">Sign In</button>
                    </Link>
                  </div>
                  <div className="eight wide column">
                    <Link to="/register">
                      <button className="ui left floated grey button">Register</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="background__animation" />
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
