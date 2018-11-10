// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

class ReadButton extends Component {
  state = {
    hasRead: false,
    canUnread: true,
    isLoading: true
  };
  componentDidMount = () => {
    this.updateFromProfile(this.props.bookId);
  };
  updateFromProfile = bookId => {
    if (this.props.auth.isAuthenticated) {
      axios.get('/api/profile').then(res => {
        let hasRead = false;
        let canUnread = true;
        res.data.booksRead.forEach(bookRead => {
          if (bookRead._id === bookId) {
            hasRead = true;
          }
        });
        if (res.data.favoriteBookObj) {
          if (res.data.favoriteBookObj._id === bookId) {
            canUnread = false;
          }
        }
        this.setState({ hasRead, canUnread }, () => {
          if (this.state.hasRead && this.state.canUnread) {
            this.updateFromReviews(bookId);
          } else {
            this.setState({ isLoading: false });
          }
        });
      });
    }
  };
  updateFromReviews = bookId => {
    axios.get('/api/profile/user/reviews').then(res => {
      res.data.reviews.forEach(review => {
        if (review.book === bookId) {
          this.setState({ canUnread: false, isLoading: false });
        } else {
          this.setState({ isLoading: false });
        }
      });
    });
  };
  readBookHandler = () => {
    this.setState({ isLoading: true }, () => {
      axios
        .put('/api/profile/booksRead', { hasRead: true, bookId: this.props.bookId })
        .then(res => {
          if (res.data.success) {
            this.setState({ hasRead: true, canUnread: true, isLoading: false });
          }
        });
    });
  };
  unreadBookHandler = () => {
    this.setState({ isLoading: true }, () => {
      axios
        .put('/api/profile/booksRead', { hasRead: false, bookId: this.props.bookId })
        .then(res => {
          if (res.data.success) {
            this.setState({ hasRead: false, canUnread: true, isLoading: false });
          }
        })
        .catch(err => {
          console.log('fuckin a');
        });
    });
  };
  render() {
    let readButton;
    if (this.props.auth.isAuthenticated) {
      if (this.state.isLoading) {
        readButton = (
          <button className="ui blue basic button loading" style={{ cursor: 'default' }}>
            I have read this
          </button>
        );
      } else {
        if (!this.state.hasRead) {
          readButton = (
            <button onClick={this.readBookHandler} className="ui blue button">
              I haven't read this
            </button>
          );
        } else if (this.state.hasRead) {
          if (this.state.canUnread) {
            readButton = (
              <button onClick={this.unreadBookHandler} className="ui blue basic button">
                I have read this
              </button>
            );
          } else if (!this.state.canUnread) {
            readButton = (
              <button className="ui blue basic button" style={{ cursor: 'default' }}>
                I have read this
              </button>
            );
          }
        }
      }
    }

    return <Fragment>{readButton}</Fragment>;
  }
}

ReadButton.propTypes = {
  auth: PropTypes.object.isRequired,
  bookId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(ReadButton);
