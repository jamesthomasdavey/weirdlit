// package
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

// css
import classes from './LikeButton.module.css';

class LikeButton extends Component {
  state = {
    likes: [],
    hasLiked: false,
    isLoading: false
  };
  componentDidMount = () => {
    this.updateFromProps();
  };
  updateFromProps = () => {
    const currentState = this.state;
    currentState.likes = this.props.review.likes;
    if (this.props.auth.isAuthenticated) {
      currentState.likes.forEach(like => {
        if (like === this.props.auth.user._id) {
          currentState.hasLiked = true;
        }
      });
    }
    this.setState(currentState);
  };
  updateFromReview = () => {
    this.setState({ isLoading: true }, () => {
      axios
        .get(`/api/books/${this.props.review.book._id}/reviews/${this.props.review._id}`)
        .then(res => {
          const currentState = this.state;
          currentState.likes = res.data.likes;
          if (this.props.auth.isAuthenticated) {
            currentState.likes.forEach(like => {
              if (like === this.props.auth.user._id) {
                currentState.hasLiked = true;
              }
            });
          }
          currentState.isLoading = false;
          this.setState(currentState);
        });
    });
  };
  toggleLikeReviewHandler = () => {
    if (!this.state.hasLiked) {
      const currentState = this.state;
      currentState.likes.push(this.props.auth.user._id);
      currentState.hasLiked = true;
      currentState.isLoading = false;
      this.setState(currentState, this.updateReview);
    } else {
      const currentState = this.state;
      let removeIndex;
      currentState.likes.forEach((like, index) => {
        if (like === this.props.auth.user._id) {
          removeIndex = index;
        }
      });
      currentState.likes.splice(removeIndex, 1);
      currentState.hasLiked = false;
      currentState.isLoading = false;
      this.setState(currentState, this.updateReview);
    }
  };
  updateReview = () => {
    this.setState({ isLoading: true }, () => {
      axios
        .put(`/api/books/${this.props.review.book._id}/reviews/${this.props.review._id}/likes`, {
          likes: this.state.likes
        })
        .then(() => {
          this.setState({ isLoading: false }, () => {
            if (this.state.hasLiked) {
              this.notifyReviewCreator();
            }
          });
        })
        .catch(this.updateFromReview);
    });
  };
  notifyReviewCreator = () => {
    if (this.props.auth.user._id !== this.props.review.creator._id) {
      axios.post(`/api/users/${this.props.review.creator._id}/notifications`, {
        content: `<strong>${this.props.auth.user.name}</strong> liked your review for <em>${
          this.props.review.book.title
        }</em>.`,
        link: `/books/${this.props.review.book._id}/reviews/${this.props.review._id}`
      });
    }
  };
  render() {
    let likeButton;

    if (this.state.likes.length > 0) {
      likeButton = (
        <div
          disabled={this.state.isLoading}
          className={['ui button labeled', !this.props.auth.isAuthenticated && 'disabled'].join(
            ' '
          )}
          tabIndex="0"
        >
          <div
            className={[
              'ui tiny button',
              classes.uiButton,
              this.state.isLoading && 'disabled',
              this.state.hasLiked ? 'active' : ''
            ].join(' ')}
            onClick={this.toggleLikeReviewHandler}
          >
            <i className={['thumbs up icon', classes.icon].join(' ')} />
          </div>
          <span className="ui label">{this.state.likes.length}</span>
        </div>
      );
    } else {
      likeButton = (
        <div
          disabled={this.state.isLoading}
          className={[
            'ui tiny button',
            this.state.isLoading && 'disabled',
            !this.props.auth.isAuthenticated && 'disabled'
          ].join(' ')}
          onClick={this.toggleLikeReviewHandler}
        >
          <i className={['thumbs up icon', classes.icon].join(' ')} />
        </div>
      );
    }

    return <Fragment>{likeButton}</Fragment>;
  }
}

LikeButton.propTypes = {
  auth: PropTypes.object.isRequired,
  review: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(LikeButton);
