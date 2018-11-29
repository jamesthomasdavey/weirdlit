// package
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import timeAgo from 'time-ago';

// component
import AuthorLinks from './../../layout/AuthorLinks/AuthorLinks';
import StarRating from './../../layout/StarRating/StarRating';
import LikeButton from './../LikeButton/LikeButton';
import CommentButton from './../CommentButton/CommentButton';
import ReviewText from './components/ReviewText/ReviewText';

// css
import classes from './Review.module.css';

const Review = props => {
  let bookImage;
  let reviewHeadline;
  let bookTitle;
  let bookAuthors;
  let reviewCreator;
  let lastUpdated;
  let showButton;
  let likeButton;
  let commentButton;
  let editButton;

  if (props.showBookInfo) {
    bookImage = (
      <Link
        to={`/books/${props.book._id}`}
        className={['ui tiny image', classes['book-image']].join(' ')}
      >
        <img alt="cover" className="book__image" src={props.book.image.mediumThumbnail} />
      </Link>
    );
  }

  if (props.showReviewHeadlineAsLink) {
    reviewHeadline = (
      <Link to={`/books/${props.book._id}/reviews/${props.review._id}`}>
        {props.review.headline}
      </Link>
    );
  } else {
    reviewHeadline = <h3>{props.review.headline}</h3>;
  }

  if (props.showBookInfo) {
    bookTitle = (
      <Link className="meta" to={`/books/${props.book._id}`}>
        <strong>{props.book.title}</strong>
      </Link>
    );
  }

  if (props.showBookAuthors) {
    bookAuthors = (
      <Fragment>
        {'by '}
        <AuthorLinks authors={props.book.authors} />
      </Fragment>
    );
  }

  if (props.showReviewCreator) {
    reviewCreator = (
      <Fragment>
        {' by '}
        <Link to={`/profile/user/${props.review.creator._id}`}>{props.review.creator.name}</Link>
      </Fragment>
    );
  }

  if (props.review.lastUpdated && props.showLastUpdated) {
    lastUpdated = (
      <span className={classes['last-updated']}>
        Last updated {timeAgo.ago(props.review.lastUpdated)}
      </span>
    );
  }

  if (props.showLikeButton) {
    likeButton = <LikeButton review={props.review} />;
  }

  if (props.showCommentButton) {
    commentButton = <CommentButton review={props.review} />;
  }

  if (props.showEditButton) {
    editButton = (
      <Link
        to={`/books/${props.review.book._id}/reviews/${props.review._id}/edit`}
        className="ui mini labeled icon button"
      >
        <i className="edit icon" />
        Edit
      </Link>
    );
  }

  return (
    <div className="ui item">
      {bookImage}
      <div className="content">
        <div className="header">{reviewHeadline}</div>
        {(props.showBookInfo || props.showBookAuthors) && (
          <div className="meta">
            <span>{bookTitle}</span>
            <span>{bookAuthors}</span>
          </div>
        )}
        <div className="meta">
          <span className={classes.postedDate}>
            Posted {timeAgo.ago(props.review.date)}
            {reviewCreator}
          </span>
          <StarRating value={Number(props.review.rating)} />
        </div>
        <div className="description">
          <ReviewText showAll={props.showReviewFullText} review={props.review.text} />
        </div>
        <div className="extra">
          {lastUpdated}
          {showButton}
        </div>
        <div className={['meta', classes.bottomLinks].join(' ')}>
          <div>
            {likeButton} {commentButton}
          </div>
          <div>{editButton}</div>
        </div>
      </div>
      <div />
    </div>
  );
};

Review.propTypes = {
  review: PropTypes.object.isRequired,
  book: PropTypes.object,
  showBookAuthors: PropTypes.bool.isRequired,
  showBookInfo: PropTypes.bool.isRequired,
  showReviewHeadlineAsLink: PropTypes.bool.isRequired,
  showReviewCreator: PropTypes.bool.isRequired,
  showReviewFullText: PropTypes.bool.isRequired,
  showLikeButton: PropTypes.bool.isRequired,
  showCommentButton: PropTypes.bool.isRequired,
  showEditButton: PropTypes.bool.isRequired,
  showLastUpdated: PropTypes.bool.isRequired,
  maxReviewChars: PropTypes.number.isRequired
};

Review.defaultProps = {
  showBookAuthors: false,
  showBookInfo: false,
  showReviewHeadlineAsLink: false,
  showReviewCreator: false,
  showReviewFullText: false,
  showLikeButton: false,
  showCommentButton: false,
  showEditButton: false,
  showLastUpdated: false,
  maxReviewChars: 600
};

export default Review;
