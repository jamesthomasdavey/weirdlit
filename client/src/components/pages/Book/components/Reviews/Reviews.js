// package
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

// component
import Review from './../../../../layout/Review/Review';
import Modal from './../../../../layout/Modal/Modal';
import StarRating from './../../../../layout/StarRating/StarRating';

// css
import classes from './Reviews.module.css';

class Reviews extends Component {
  state = {
    reviews: [],
    isLoading: true,
    canReview: false,
    modal: '',
    errors: {}
  };
  componentDidMount = () => {
    axios
      .get(`/api/books/${this.props.book._id}/reviews`)
      .then(res => {
        let canReview = true;
        if (this.props.auth.isAuthenticated && res.data.length > 0) {
          res.data.forEach(review => {
            if (review.creator._id === this.props.auth.user._id) {
              canReview = false;
            }
          });
        }
        this.setState({ reviews: res.data, isLoading: false, canReview, errors: {} });
      })
      .catch(err => {
        this.setState({ reviews: [], isLoading: false, errors: err });
      });
  };

  render() {
    let reviewsContent;

    let firstReviewButton;
    let reviewButton;

    if (!this.state.isLoading) {
      if (this.state.reviews.length === 0) {
        if (this.props.auth.isAuthenticated) {
          firstReviewButton = (
            <h5 style={{ textAlign: 'center' }}>
              Nobody has written any reviews for {this.props.book.title}.{' '}
              <Link to={`/books/${this.props.book._id}/reviews/new`}>Be the first!</Link>
            </h5>
          );
        } else if (!this.props.auth.isAuthenticated) {
          firstReviewButton = (
            <h5 style={{ textAlign: 'center' }}>
              Nobody has written any reviews for {this.props.book.title}.{' '}
              <span onClick={() => this.setState({ modal: 'login' })} className={classes.linkStyle}>
                Be the first!
              </span>
            </h5>
          );
        }
      }
      if (this.state.reviews.length > 0) {
        if (this.props.auth.isAuthenticated) {
          reviewButton = (
            <Link
              to={`/books/${this.props.book._id}/reviews/new`}
              className={['ui tiny primary button', this.state.canReview ? '' : 'disabled'].join(
                ' '
              )}
              disabled={!this.state.canReview}
            >
              Write a Review
            </Link>
          );
        }
        if (!this.props.auth.isAuthenticated) {
          reviewButton = (
            <button
              onClick={() => this.setState({ modal: 'login' })}
              className={['ui tiny primary button', this.state.canReview ? '' : 'disabled'].join(
                ' '
              )}
              disabled={!this.state.canReview}
            >
              Write a Review
            </button>
          );
        }
      }
    }

    const sortedReviews = [...this.state.reviews]
      .sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      })
      .reverse();

    const numberOfReviewsToDisplay = 5;

    if (this.state.reviews.length > 0) {
      let recentSortedReviews;
      if (this.state.reviews.length > numberOfReviewsToDisplay) {
        recentSortedReviews = sortedReviews.splice(0, numberOfReviewsToDisplay);
      } else {
        recentSortedReviews = sortedReviews;
      }
      reviewsContent = recentSortedReviews.map(review => {
        return (
          <Review
            key={review._id}
            review={review}
            book={this.props.book}
            showReviewHeadlineAsLink
            showReviewCreator
            showLikeButton
            showCommentButton
          />
        );
      });
    }

    return (
      <Fragment>
        <Modal formType={this.state.modal} hideModal={() => this.setState({ modal: '' })} />
        <h5 className="ui horizontal divider header">
          <i className="align left icon" />
          Reviews for {this.props.book.title}
        </h5>
        {this.props.book.rating && <StarRating center large value={this.props.book.rating} />}
        <div
          className={['ui raised segment', this.state.isLoading ? 'loading' : ''].join(' ')}
          style={{ padding: '22px' }}
        >
          {this.state.isLoading && (
            <Fragment>
              <br />
              <br />
              <br />
              <br />
            </Fragment>
          )}
          {firstReviewButton}
          {!this.state.isLoading && this.state.reviews.length > 0 && (
            <div className="ui divided items">{reviewsContent}</div>
          )}
        </div>
        <div style={{ textAlign: 'center' }}>
          {reviewButton}
          {this.state.reviews.length > numberOfReviewsToDisplay && (
            <Link to={`/books/${this.props.book._id}/reviews`} className="ui tiny button">
              View All
            </Link>
          )}
        </div>
      </Fragment>
    );
  }
}

Reviews.propTypes = {
  book: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(Reviews);
