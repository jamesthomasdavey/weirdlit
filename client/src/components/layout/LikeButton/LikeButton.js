// package
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

// component
import Modal from './../Modal/Modal';

// css
import classes from './LikeButton.module.css';

class LikeButton extends Component {
  state = {
    likes: [],
    hasLiked: false,
    isLoading: false,
    modal: ''
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
  checkIfLiked = () => {
    const currentState = this.state;
    currentState.hasLiked = false;
    currentState.likes.forEach(like => {
      if (like === this.props.auth.user._id) {
        currentState.hasLiked = true;
      }
    });
    currentState.isLoading = false;
    this.setState(currentState, () => {
      if (currentState.hasLiked) {
        this.notifyReviewCreator();
      }
    });
  };
  toggleLikeReviewHandler = () => {
    if (!this.props.auth.isAuthenticated) {
      this.setState({ modal: 'login' });
    } else {
      this.setState({ isLoading: true }, () => {
        if (!this.state.hasLiked) {
          axios
            .post(`/api/books/${this.props.review.book._id}/reviews/${this.props.review._id}/likes`)
            .then(res => {
              this.setState({ likes: res.data.likes }, this.checkIfLiked);
            });
        } else {
          axios
            .delete(
              `/api/books/${this.props.review.book._id}/reviews/${this.props.review._id}/likes/${
                this.props.auth.user._id
              }`
            )
            .then(res => {
              this.setState({ likes: res.data.likes }, this.checkIfLiked);
            });
        }
      });
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

    if (this.state.likes.length > 0) {
      likeButton = (
        <div disabled={this.state.isLoading} className="ui mini button labeled" tabIndex="0">
          <div
            className={[
              'ui mini button',
              classes.uiButton,
              this.state.isLoading ? 'disabled' : '',
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
          className={['ui mini button', this.state.isLoading ? 'disabled' : ''].join(' ')}
          onClick={this.toggleLikeReviewHandler}
        >
          <i className={['thumbs up icon', classes.icon].join(' ')} />
        </div>
      );
    }

    return (
      <Fragment>
        <Modal formType={this.state.modal} hideModal={() => this.setState({ modal: '' })} />
        {likeButton}
      </Fragment>
    );
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
