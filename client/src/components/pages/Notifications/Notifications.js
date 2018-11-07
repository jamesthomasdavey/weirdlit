// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Notifications extends Component {
  state = {
    notifications: [],
    isLoading: true
  };
  componentDidMount = () => {
    this.updateFromNotifications();
  };
  updateFromNotifications = () => {
    axios.get('/api/users/notifications').then(res => {
      this.setState({ isLoading: false, notifications: res.data });
    });
  };
  render() {
    return <div />;
  }
}

Notifications.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Notifications);
