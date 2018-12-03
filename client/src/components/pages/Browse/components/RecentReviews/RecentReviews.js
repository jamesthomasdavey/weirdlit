// package
import React, { Component, Fragment } from 'react';
import axios from 'axios';

// component
import Review from './../../../../layout/Review/Review';

class RecentReviews extends Component {
  state = {
    reviews: [],
    isLoading: true
  };
  componentDidMount = () => {
    axios.get('/api/books/reviews').then(res => {
      this.setState({ reviews: res.data, isLoading: false });
    });
  };
  render() {
    let reviews;

    if (!this.state.isLoading) {
      reviews = this.state.reviews.map(review => {
        return (
          <Review
            key={review._id + '_recentReviewKey'}
            review={review}
            book={review.book}
            showBookAuthors
            showBookInfo
            showReviewHeadlineAsLink
            showReviewCreator
            showLikeButton
            showCommentButton
            showLastUpdated
          />
        );
      });
    }
    return (
      <Fragment>
        <h5 className="ui horizontal divider header">
          <i className="align left icon" />
          Recent Reviews
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
          {!this.state.isLoading && <div className="ui divided items">{reviews}</div>}
        </div>
      </Fragment>
    );
  }
}

export default RecentReviews;
