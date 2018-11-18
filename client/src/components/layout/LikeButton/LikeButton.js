// package
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

// css
import classes from './LikeButton.module.css';

class LikeButton extends Component {
  state = {
    likes: 0,
    hasLiked: false,
    isLoading: false
  };
  componentDidMount = () => {
    this.updateFromProps();
  };
  updateFromProps = () => {
    const currentState = this.state;
    currentState.likes = this.props.review.likes.length;
    if (this.props.auth.isAuthenticated) {
      this.props.review.likes.forEach(like => {
        if (this.props.auth.user._id.toString() === like.user.toString()) {
          currentState.hasLiked = true;
        }
      });
    }
    this.setState(currentState);
  };
  toggleLikeReviewHandler = () => {
    if (this.props.auth.isAuthenticated) {
      this.setState({ isLoading: true }, () => {
        if (!this.state.hasLiked) {
          axios
            .post(`/api/books/${this.props.review.book._id}/reviews/${this.props.review._id}/like`)
            .then(res => {
              this.setState(
                { likes: res.data.likes.length, hasLiked: true, isLoading: false },
                this.notifyReviewCreator
              );
            });
        } else if (this.state.hasLiked) {
          axios
            .post(
              `/api/books/${this.props.review.book._id}/reviews/${this.props.review._id}/unlike`
            )
            .then(res => {
              this.setState({ likes: res.data.likes.length, hasLiked: false, isLoading: false });
            });
        }
      });
    } else {
      /// MODAL
    }
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

    if (this.state.likes > 0) {
      likeButton = (
        <div
          className={['ui button labeled', !this.props.auth.isAuthenticated && 'disabled'].join(
            ' '
          )}
          tabIndex="0"
        >
          <div
            className={[
              'ui tiny button',
              classes.uiButton,
              this.state.isLoading && 'loading',
              this.state.hasLiked ? 'active' : ''
            ].join(' ')}
            onClick={this.toggleLikeReviewHandler}
          >
            <i className={['thumbs up icon', classes.icon].join(' ')} />
          </div>
          <span className="ui label">{this.state.likes}</span>
        </div>
      );
    } else {
      likeButton = (
        <div
          className={[
            'ui tiny button',
            this.state.isLoading && 'loading',
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
