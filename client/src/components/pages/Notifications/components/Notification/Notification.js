// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import renderHTML from 'react-render-html';
import axios from 'axios';

// css
import classes from './Notification.module.css';

class Notification extends Component {
  state = {
    isBeingDeleted: false,
    isLoading: false
  };
  deleteNotificationHandler = notificationId => {
    this.setState({ isLoading: true }, () => {
      axios.delete(`/api/users/notifications/${notificationId}`).then(res => {
        this.setState({ isBeingDeleted: true }, () => {
          this.props.deleteNotificationHandler();
        });
      });
    });
  };
  readNotificationHandler = () => {
    if (this.props.notification.read) {
      this.props.history.push(this.props.notification.link);
    } else {
      this.setState({ isLoading: true }, () => {
        axios.put(`/api/users/notifications/${this.props.notification._id}`).then(res => {
          this.props.history.push(this.props.notification.link);
        });
      });
    }
  };
  render() {
    return (
      <div
        className={[
          'ui message clearfix',
          this.props.notification.read ? '' : 'info',
          this.state.isBeingDeleted ? classes.deleted : ''
        ].join(' ')}
      >
        {this.state.isLoading && <div className="ui active loader" />}
        <div className={classes.content}>
          <div className={classes.book__title}>{renderHTML(this.props.notification.content)}</div>
          <div className={classes.buttons}>
            <button
              onClick={this.readNotificationHandler}
              className={[
                'ui tiny button',
                classes.view__button,
                this.props.notification.read ? 'grey' : 'blue'
              ].join(' ')}
            >
              View
            </button>{' '}
            <i
              onClick={() => this.deleteNotificationHandler(this.props.notification._id)}
              className={['close icon', classes.close__button].join(' ')}
            />
          </div>
        </div>
      </div>
    );
  }
}

Notification.propTypes = {
  notification: PropTypes.object.isRequired,
  deleteNotificationHandler: PropTypes.func.isRequired
};

export default withRouter(Notification);
