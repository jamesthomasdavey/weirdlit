import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from './../../../actions/profileActions';
import Spinner from './../../layout/Spinner/Spinner';

import Navbar from './../../layout/Navbar/Navbar';

class Dashboard extends Component {
  componentDidMount = () => {
    this.props.getCurrentProfile();
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push('/browse');
    }
  };
  componentDidUpdate = () => {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push('/browse');
    }
  };
  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;

    if (profile === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      dashboardContent = <h4>Other stuff</h4>;
    }

    document.title = 'Dashboard | WeirdLit';
    return (
      <Fragment>
        <Navbar />
        <div className="ui container">
          <h1>Hello, {user.name}</h1>
          {dashboardContent}
        </div>
      </Fragment>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(Dashboard);
