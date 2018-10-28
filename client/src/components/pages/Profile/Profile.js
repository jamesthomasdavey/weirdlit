import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Navbar from './../../layout/Navbar/Navbar';

class Profile extends Component {
  componentDidUpdate = () => {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push('/browse');
    }
  };
  render() {
    const { user } = this.props.auth;
    document.title = user.name + ' | WeirdLit';
    return (
      <Fragment>
        <Navbar />
      </Fragment>
    );
  }
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(Profile);
