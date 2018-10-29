import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from './../../../actions/profileActions';

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
    document.title = 'Dashboard | WeirdLit';
    return (
      <Fragment>
        <Navbar />
        <div className="ui container">
          <h1>Dashboard</h1>
        </div>
      </Fragment>
    );
  }
}
Dashboard.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(Dashboard);
