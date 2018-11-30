import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Browse from './../Browse/Browse';
import WelcomePage from './../WelcomePage/WelcomePage';

class Root extends Component {
  render() {
    if (this.props.auth.isAuthenticated) {
      return <Browse />;
    } else {
      return <WelcomePage />;
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
