// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import axios from 'axios';

// component
import Notification from './components/Notification/Notification';

class Notifications extends Component {
  state = {
    notifications: [],
    isLoading: true,
    isClearing: false
  };
  componentDidMount = () => {
    this.updateFromNotifications();
  };
  updateFromNotifications = () => {
    axios
      .get('/api/users/notifications')
      .then(res => {
        this.setState({
          isLoading: false,
          isClearing: false,
          notifications: res.data.notifications
        });
      })
      .catch(err => {
        this.setState({ isLoading: false, isClearing: false, notifications: [] });
      });
  };
  deleteNotificationHandler = () => {
    setTimeout(() => {
      this.updateFromNotifications();
    }, 400);
  };
  clearNotificationsHandler = () => {
    this.setState({ isClearing: true });
    axios.delete('/api/users/notifications').then(this.updateFromNotifications);
  };
  render() {
    document.title = 'Notifications | WeirdLit';

    let notificationsContent;

    if (!this.state.isLoading && this.state.notifications.length > 0) {
      const notifications = [...this.state.notifications];
      notificationsContent = notifications.reverse().map(notification => {
        return (
          <Notification
            key={notification._id}
            notification={notification}
            deleteNotificationHandler={this.deleteNotificationHandler}
          />
        );
      });
    } else {
      notificationsContent = (
        <h5 style={{ textAlign: 'center', padding: '2rem' }}>No notifications to display.</h5>
      );
    }

    return (
      <div className="ui text container">
        <div
          className={[
            'ui segment',
            this.state.isLoading || this.state.isClearing ? 'loading' : ''
          ].join(' ')}
        >
          {this.state.notifications.length > 0 && !this.state.isLoading && (
            <h5 className="ui horizontal divider header">
              <i className="exclamation circle icon" />
              Notifications
            </h5>
          )}
          {this.state.isLoading && (
            <Fragment>
              <br />
              <br />
              <br />
              <br />
            </Fragment>
          )}
          {notificationsContent}
          {this.state.notifications.length > 0 && !this.state.isLoading && (
            <div style={{ textAlign: 'center' }}>
              <button onClick={this.clearNotificationsHandler} className="ui tiny button">
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

Notifications.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Notifications);
