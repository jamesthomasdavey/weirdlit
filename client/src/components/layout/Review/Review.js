// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import timeAgo from 'time-ago';

// component
import AuthorLinks from './../../layout/AuthorLinks/AuthorLinks';
import StarRating from './../../layout/StarRating/StarRating';
import LikeButton from './../LikeButton/LikeButton';
import CommentButton from './../CommentButton/CommentButton';

// css
import classes from './Review.module.css';

class Review extends Component {
  state = {
    displayFullReview: false
  };
  toggleDisplayFullReview = () => {
    const displayFullReview = !this.state.displayFullReview;
    this.setState({ displayFullReview });
  };
  render() {
    let bookImage;
    let reviewHeadline;
    let bookTitle;
    let bookAuthors;
    let reviewCreator;
    let reviewText;
    let lastUpdated;
    let showButton;
    let likeButton;
    let commentButton;

    if (this.props.showBookInfo) {
      bookImage = (
        <Link
          to={`/books/${this.props.book._id}`}
          className={['ui tiny image', classes['book-image']].join(' ')}
        >
          <img alt="cover" className="book__image" src={this.props.book.image.mediumThumbnail} />
        </Link>
      );
    }

    if (this.props.showReviewHeadlineAsLink) {
      reviewHeadline = (
        <Link to={`/books/${this.props.book._id}/reviews/${this.props.review._id}`}>
          {this.props.review.headline}
        </Link>
      );
    } else {
      reviewHeadline = this.props.review.headline;
    }

    if (this.props.showBookInfo) {
      bookTitle = (
        <Link className="meta" to={`/books/${this.props.book._id}`}>
          <strong>{this.props.book.title}</strong>
        </Link>
      );
    }

    if (this.props.showBookAuthors) {
      bookAuthors = (
        <Fragment>
          {'by '}
          <AuthorLinks authors={this.props.book.authors} />
        </Fragment>
      );
    }

    if (this.props.showReviewCreator) {
      reviewCreator = (
        <Fragment>
          {' by '}
          <Link to={`/profile/user/${this.props.review.creator._id}`}>
            {this.props.review.creator.name}
          </Link>
        </Fragment>
      );
    }

    if (this.props.showReviewFullText) {
      reviewText = this.props.review.text;
    } else {
      if (this.state.displayFullReview) {
        reviewText = this.props.review.text;
      } else {
        const shortenedTextArray = this.props.review.text
          .substring(0, this.props.maxReviewChars)
          .split(' ');
        const shortenedText =
          shortenedTextArray.splice(0, shortenedTextArray.length - 1).join(' ') + '...';
        reviewText = shortenedText;
      }
    }

    if (this.props.review.lastUpdated) {
      lastUpdated = (
        <span className={classes['last-updated']}>
          Last updated {timeAgo.ago(this.props.review.lastUpdated)}
        </span>
      );
    }

    if (!this.props.showReviewFullText) {
      if (this.props.review.text.length > this.props.maxReviewChars) {
        showButton = (
          <span onClick={this.toggleDisplayFullReview} className={classes.show__toggle}>
            {this.state.displayFullReview ? 'Show less' : 'Show more'}
          </span>
        );
      }
    }

    if (this.props.showReviewSocial) {
      likeButton = <LikeButton review={this.props.review} />;
      commentButton = <CommentButton review={this.props.review} />;
    }

    return (
      <div className="ui item">
        {bookImage}
        <div className="content">
          <div className="header">{reviewHeadline}</div>
          <div className="meta">
            <span>{bookTitle}</span>
            <span>{bookAuthors}</span>
          </div>
          <div className="meta">
            <span>
              Posted {timeAgo.ago(this.props.review.date)}
              {reviewCreator}
            </span>
            <StarRating value={Number(this.props.review.rating)} />
          </div>
          <div className="description">
            <p>
              {reviewText.split('\n').map((item, key) => {
                return (
                  <span key={key}>
                    {item}
                    <br />
                  </span>
                );
              })}
            </p>
          </div>
          <div className="extra">
            {lastUpdated}
            {showButton}
          </div>
          <div className="meta">
            {likeButton} {commentButton}
          </div>
        </div>
        <div />
      </div>
    );
  }
}

Review.propTypes = {
  review: PropTypes.object.isRequired,
  book: PropTypes.object.isRequired,
  showBookAuthors: PropTypes.bool.isRequired,
  showBookInfo: PropTypes.bool.isRequired,
  showReviewHeadlineAsLink: PropTypes.bool.isRequired,
  showReviewCreator: PropTypes.bool.isRequired,
  showReviewFullText: PropTypes.bool.isRequired,
  showReviewSocial: PropTypes.bool.isRequired,
  maxReviewChars: PropTypes.number.isRequired
};

Review.defaultProps = {
  showBookAuthors: false,
  showBookInfo: false,
  showReviewHeadlineAsLink: false,
  showReviewCreator: false,
  showReviewFullText: false,
  showReviewSocial: false,
  maxReviewChars: 600
};

export default Review;
