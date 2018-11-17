// package
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import timeAgo from 'time-ago';

class Comment extends Component {
  render() {
    return (
      <div className="comment">
        <Link to={`/profile/user/${this.props.comment.creator._id}`} className="author">
          {this.props.comment.creator.name}
        </Link>
        <div className="metadata">
          <span className="date">{timeAgo.ago(this.props.comment.date)}</span>
        </div>
        <div className="text">{this.props.comment.text}</div>
      </div>
    );
  }
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired
};

export default Comment;
