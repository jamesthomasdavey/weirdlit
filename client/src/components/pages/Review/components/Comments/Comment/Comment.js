// package
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import timeAgo from 'time-ago';
import { connect } from 'react-redux';
import axios from 'axios';

// css
import classes from './Comment.module.css';

class Comment extends Component {
  state = {
    isLoading: false,
    isBeingDeleted: false,
    isCurrentUser: false
  };
  componentDidMount = () => {
    if (this.props.auth.user._id === this.props.comment.creator._id) {
      this.setState({ isCurrentUser: true });
    }
  };
  deleteCommentHandler = commentId => {
    this.setState({ isLoading: true }, () => {
      axios
        .delete(
          `/api/books/${this.props.review.book._id}/reviews/${
            this.props.review._id
          }/comments/${commentId}`
        )
        .then(() => {
          this.setState({ isBeingDeleted: true }, () => {
            this.props.deleteCommentHandler();
          });
        });
    });
  };
  render() {
    return (
      <div
        className={['comment', this.state.isBeingDeleted ? classes.deleted : ''].join(' ')}
        id={this.props.comment._id}
      >
        {this.state.isLoading && <div className="ui active loader" />}
        <div className="content">
          <Link
            to={`/profile/user/${this.props.comment.creator._id}`}
            className={['author', this.state.isLoading ? classes.loading : ''].join(' ')}
          >
            {this.props.comment.creator.name}
          </Link>
          <div className="metadata">
            <span className="date">{timeAgo.ago(this.props.comment.date)}</span>
          </div>
          <div className={['text', this.state.isLoading ? classes.loading : ''].join(' ')}>
            {this.props.comment.text.split('\n').map((item, key) => {
              return (
                <span key={key}>
                  {item}
                  <br />
                </span>
              );
            })}
          </div>
          {this.state.isCurrentUser && (
            <div className="actions">
              <span
                href="#"
                onClick={() => this.deleteCommentHandler(this.props.comment._id)}
                className={[
                  'ui reply',
                  classes.deleteButton,
                  this.state.isLoading ? classes.loading : ''
                ].join(' ')}
              >
                Delete
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  review: PropTypes.object.isRequired,
  deleteCommentHandler: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(Comment);
