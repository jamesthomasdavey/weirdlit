// package
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

// component
import Review from './Review/Review';

class Reviews extends Component {
  state = {
    reviews: [],
    isLoading: true,
    errors: {}
  };
  componentDidMount = () => {
    axios
      .get(`/api/books/${this.props.bookId}/reviews`)
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
            headline={review.headline}
            rating={review.rating}
            text={review.text}
            date={review.date}
            lastUpdated={review.lastUpdated}
            creator={review.creator}
            history={this.props.history}
          />
        );
      });
    }

    return (
      <Fragment>
        <h5 className="ui horizontal divider header">
          <i className="align left icon" />
          Reviews for {this.props.bookTitle}
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
              Nobody has written any reviews for {this.props.bookTitle}.{' '}
              <Link to={`/books/${this.props.bookId}/reviews/new`}>Be the first!</Link>
            </h5>
          )}
          {!this.state.isLoading && this.state.reviews.length > 0 && (
            <div className="ui divided items">{reviewsContent}</div>
          )}
          {this.state.reviews.length > numberOfReviewsToDisplay && (
            <div style={{ textAlign: 'center' }}>
              <Link to={`/books/${this.props.bookId}/reviews`} className="ui tiny button">
                View All
              </Link>
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}

Reviews.propTypes = {
  bookId: PropTypes.string.isRequired,
  bookTitle: PropTypes.string.isRequired
};

export default Reviews;