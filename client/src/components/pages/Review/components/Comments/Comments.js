// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

// validation
import isEmpty from './../../../../../validation/is-empty';

// component
import TextAreaInputField from './../../../../layout/TextAreaInputField/TextAreaInputField';
import Comment from './Comment/Comment';

class Comments extends Component {
  state = {
    comments: [],
    newComment: '',
    isLoading: false,
    isSubmitting: false,
    errors: {}
  };
  componentDidMount = () => {
    this.updateFromProps();
  };
  updateFromProps = () => {
    this.setState({ comments: this.props.review.comments });
  };
  changeInputHandler = e => {
    const currentState = this.state;
    currentState[e.target.name] = e.target.value;
    currentState.errors = {};
    this.setState(currentState);
  };
  formSubmitHandler = e => {
    e.preventDefault();
    this.setState({ isSubmitting: true }, () => {
      axios
        .post(
          `/api/books/${this.props.review.book._id}/reviews/${this.props.review._id}/comments`,
          {
            text: this.state.newComment
          }
        )
        .then(res => {
          if (res.data.errors && !isEmpty(res.data.errors)) {
            this.setState({ errors: res.data.errors, isSubmitting: false });
          } else {
            this.setState({ isSubmitting: false, isLoading: true }, () => {
              this.notifyReviewerHandler(res.data.comment);
            });
          }
        });
    });
  };
  notifyReviewerHandler = comment => {
    if (this.props.auth.user._id !== this.props.review.creator._id) {
      axios
        .post(`/api/users/${this.props.review.creator._id}/notifications`, {
          content: `<strong>${
            this.props.auth.user.name
          }</strong> commented on your review for <em>${this.props.review.book.title}</em>.`,
          link: `/books/${this.props.review.book._id}/reviews/${this.props.review._id}/#${
            comment._id
          }`
        })
        .then(this.updateFromReview);
    } else {
      this.updateFromReview();
    }
  };
  updateFromReview = () => {
    axios
      .get(`/api/books/${this.props.review.book._id}/reviews/${this.props.review._id}`)
      .then(res => {
        this.setState({ comments: res.data.comments, isLoading: false, newComment: '' });
      });
  };
  deleteCommentHandler = () => {
    setTimeout(() => {
      this.updateFromReview();
    }, 400);
  };
  render() {
    let comments;
    if (this.state.comments.length === 0) {
      comments = <h5 style={{ textAlign: 'center' }}>Nobody has commented on this review.</h5>;
    } else {
      const commentsContent = this.state.comments.map(comment => (
        <Comment
          key={comment._id}
          comment={comment}
          review={this.props.review}
          deleteCommentHandler={this.deleteCommentHandler}
        />
      ));
      comments = <div className="ui comments">{commentsContent}</div>;
    }

    return (
      <div>
        <h5 className="ui horizontal divider header" id="comments">
          <i className="comment outline icon" />
          Comments
        </h5>
        <div
          className={['ui raised segment', this.state.isLoading && 'loading'].join(' ')}
          style={{ padding: '22px' }}
        >
          {comments}
          <div className="ui dividing header" />
          <form className="ui form" onSubmit={this.formSubmitHandler}>
            <TextAreaInputField
              name="newComment"
              minHeight="100px"
              rows="1"
              placeholder="Add a new comment..."
              value={this.state.newComment}
              maxLength="600"
              onChange={this.changeInputHandler}
              error={this.state.errors.newComment}
              info={
                this.state.newComment &&
                `Characters remaining: ${600 - this.state.newComment.length}`
              }
            />
            <button
              className={['ui primary tiny button', this.state.isSubmitting && 'loading'].join(' ')}
            >
              Comment
            </button>
          </form>
        </div>
      </div>
    );
  }
}

Comments.propTypes = {
  review: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(withRouter(Comments));
