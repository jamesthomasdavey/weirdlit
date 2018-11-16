// package
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

// component
import Review from './../../../../layout/Review/Review';

class Reviews extends Component {
  state = {
    reviews: [],
    isLoading: true,
    errors: {}
  };
  componentDidMount = () => {
    axios
      .get(`/api/books/${this.props.book._id}/reviews`)
      .then(res => {
        this.setState({ reviews: res.data, isLoading: false, errors: {} });
      })
      .catch(err => {
        this.setState({ reviews: [], isLoading: false, errors: err });
      });
  };

  render() {
    let reviewsContent;

    const sortedReviews = [...this.state.reviews]
      .sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      })
      .reverse();

    let hasReviewed;

    if (this.props.auth.isAuthenticated && this.state.reviews.length > 0) {
      this.state.reviews.forEach(review => {
        if (review.creator._id === this.props.auth.user._id) {
          hasReviewed = true;
        }
      });
    }

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
            showReviewSocial
          />
        );
      });
    }

    return (
      <Fragment>
        <h5 className="ui horizontal divider header">
          <i className="align left icon" />
          Reviews for {this.props.book.title}
        </h5>
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
          {!this.state.isLoading && this.state.reviews.length === 0 && (
            <h5 style={{ textAlign: 'center' }}>
              Nobody has written any reviews for {this.props.book.title}.{' '}
              <Link to={`/books/${this.props.book._id}/reviews/new`}>Be the first!</Link>
            </h5>
          )}
          {!this.state.isLoading && this.state.reviews.length > 0 && (
            <div className="ui divided items">{reviewsContent}</div>
          )}
        </div>
        <div style={{ textAlign: 'center' }}>
          {!this.state.isLoading && !hasReviewed && this.state.reviews.length > 0 && (
            <Link
              to={`/books/${this.props.book._id}/reviews/new`}
              className="ui tiny primary button"
            >
              Write a Review
            </Link>
          )}
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
