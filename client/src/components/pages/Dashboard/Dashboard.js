import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Navbar from './../../layout/Navbar/Navbar';

class Dashboard extends Component {
  componentDidMount = () => {
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
  {}
)(Dashboard);
