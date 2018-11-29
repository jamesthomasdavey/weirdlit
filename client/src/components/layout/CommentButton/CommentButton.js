// package
import React from 'react';
import PropTypes from 'prop-types';
import { HashLink } from 'react-router-hash-link';

const CommentButton = props => {
  return (
    <HashLink
      to={`/books/${props.review.book._id}/reviews/${props.review._id}/#comments`}
      className="ui mini button"
    >
      Comments{props.review.comments.length > 0 && ` (${props.review.comments.length})`}
    </HashLink>
  );
};

CommentButton.propTypes = {
  review: PropTypes.object.isRequired
};

export default CommentButton;
