// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';

class ReadButton extends Component {
  state = {
    hasRead: false,
    canUnread: true,
    isLoading: true,
    errors: []
  };
  componentDidMount = () => {
    // update state if authenticated
    if (this.props.auth.isAuthenticated) {
      this.updateFromProfile(this.props.bookId);
    }
  };
  updateFromProfile = bookId => {
    axios.get('/api/profile').then(res => {
      let hasRead = false;
      let canUnread = true;
      // check if the user has read it
      res.data.booksRead.forEach(bookRead => {
        if (bookRead._id === bookId) {
          hasRead = true;
        }
      });
      // if the user's favorite book is in the database,
      if (res.data.favoriteBookObj) {
        // and if it's selected as the user's favorite book,
        if (res.data.favoriteBookObj._id === bookId) {
          // then they can't unread it
          canUnread = false;
        }
      }
      // set the state with the current settings
      this.setState({ hasRead, canUnread }, () => {
        // if the user has read it and can unread it,
        if (this.state.hasRead && this.state.canUnread) {
          // then check if they have written any reviews
          this.updateFromReviews(bookId);
        } else {
          // otherwise, just set loading to false
          this.setState({ isLoading: false });
        }
      });
    });
  };
  updateFromReviews = bookId => {
    axios.get('/api/profile/user/reviews').then(res => {
      // if the user has any reviews,
      if (res.data.reviews.length > 0) {
        // check each review
        res.data.reviews.forEach(review => {
          if (review.book === bookId) {
            this.setState({ canUnread: false, isLoading: false });
          } else {
            this.setState({ isLoading: false });
          }
        });
      } else {
        this.setState({ isLoading: false });
      }
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
        })
        .catch(err => {
          console.log('unable to read');
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
          console.log('unable to unread');
        });
    });
  };
  render() {
    let readButton;
    if (this.props.auth.isAuthenticated) {
      if (this.state.isLoading) {
        readButton = (
          <button
            className="ui teal disabled labeled icon button loading small"
            style={{ cursor: 'default' }}
          >
            <i className="check circle outline icon" />I have read this
          </button>
        );
      } else {
        if (!this.state.hasRead) {
          readButton = (
            <button onClick={this.readBookHandler} className="ui grey labeled icon button small">
              <i className="circle outline icon" />I haven't read this
            </button>
          );
        } else if (this.state.hasRead) {
          if (this.state.canUnread) {
            readButton = (
              <button
                onClick={this.unreadBookHandler}
                className="ui teal labeled icon button small"
              >
                <i className="check circle outline icon" />I have read this
              </button>
            );
          } else if (!this.state.canUnread) {
            readButton = (
              <button
                className="ui teal labeled icon button small disabled"
                disabled
                style={{ cursor: 'default' }}
              >
                <i className="check circle outline icon" />I have read this
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
