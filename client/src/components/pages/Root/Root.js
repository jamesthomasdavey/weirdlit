import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Browse from './../Browse/Browse';
import Landing from './../Landing/Landing';

class Root extends Component {
  render() {
    const { isAuthenticated } = this.props.auth;
    if (isAuthenticated) {
      return <Browse />;
    } else {
      return <Landing />;
    }
  }
}

Root.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(Root);
