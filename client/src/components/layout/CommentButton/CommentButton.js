// package
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const CommentButton = props => {
  return (
    <Link
      to={`/books/${props.review.book._id}/reviews/${props.review._id}/#comment`}
      className="ui tiny button"
    >
      Comment{props.review.comments.length > 0 && `(${props.review.comments.length})`}
    </Link>
  );
};

CommentButton.propTypes = {
  review: PropTypes.object.isRequired
};

export default CommentButton;
