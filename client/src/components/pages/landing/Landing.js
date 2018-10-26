import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

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
        {/* <div className="landing">
          <div className="landing__container">
            <div className="landing__logo-text">
              <Link to="/browse">
                <span className="landing__logo-text-weird">Weird</span>
                <span className="landing__logo-text-lit">Lit</span>
              </Link>
            </div>
          </div>
        </div> */}
        <div className="animation__container">
          <div className="animation" />
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
