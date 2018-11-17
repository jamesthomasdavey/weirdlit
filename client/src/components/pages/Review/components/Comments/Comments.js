// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

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
        .then(() => {
          this.setState({ isSubmitting: false }, this.updateFromReview);
        });
    });
  };
  updateFromReview = () => {
    this.setState({ isLoading: true }, () => {
      axios
        .get(`/api/books/${this.props.review.book._id}/reviews/${this.props.review._id}`)
        .then(res => {
          this.setState({ comments: res.data.comments, isLoading: false, newComment: '' });
        });
    });
  };
  render() {
    let comments;
    if (this.state.comments.length === 0) {
      comments = <h5 style={{ textAlign: 'center' }}>Nobody has commented on this review.</h5>;
    } else {
      const commentsContent = this.state.comments.map(comment => (
        <Comment key={comment._id} comment={comment} />
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
  review: PropTypes.object.isRequired
};

export default Comments;
