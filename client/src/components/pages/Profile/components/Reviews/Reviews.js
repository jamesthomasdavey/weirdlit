// package
import React, { Component, Fragment } from 'react';
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
      .get(`/api/profile/user/${this.props.userId}/reviews`)
      .then(res => {
        this.setState({ reviews: res.data.reviews, isLoading: false });
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
            review={review}
            book={review.book}
            showBookAuthors
            showBookInfo
            showReviewHeadlineAsLink
            showLikeButton
            showCommentButton
          />
        );
      });
    }

    return (
      <Fragment>
        <h5 className="ui horizontal divider header">
          <i className="align left icon" />
          Reviews by {this.props.name.split(' ')[0]}
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
              {this.props.name.split(' ')[0]} has not yet written any reviews.
            </h5>
          )}
          {!this.state.isLoading && this.state.reviews.length > 0 && (
            <div className="ui divided items">{reviewsContent}</div>
          )}
          {this.state.reviews.length > numberOfReviewsToDisplay && (
            <div style={{ textAlign: 'center' }}>
              <Link to={`/profile/user/${this.props.userId}/reviews`} className="ui tiny button">
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
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default Reviews;
