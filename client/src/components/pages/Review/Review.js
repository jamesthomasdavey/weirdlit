// package
import React, { Component } from 'react';
import axios from 'axios';

// Component
import { default as ReviewComponent } from './../../layout/Review/Review';
import Spinner from './../../layout/Spinner/Spinner';
import Comments from './components/Comments/Comments';

class Review extends Component {
  state = {
    review: {},
    isLoading: true
  };
  componentDidMount = () => {
    if (this.props.match.params.bookId && this.props.match.params.reviewId) {
      this.updateFromReview(this.props.match.params.bookId, this.props.match.params.reviewId);
    }
  };
  updateFromReview = (bookId, reviewId) => {
    axios.get(`/api/books/${bookId}/reviews/${reviewId}`).then(res => {
      this.setState({ review: res.data, isLoading: false });
    });
  };
  render() {
    let review;
    let comments;

    if (this.state.isLoading) {
      review = <Spinner />;
    } else {
      review = <ReviewComponent review={this.state.review} showReviewCreator showReviewFullText />;
    }

    if (!this.state.isLoading) {
      comments = <Comments review={this.state.review} />;
    }

    return (
      <div className="ui text container">
        <div className="ui segment">
          <div className="ui raised segment" style={{ padding: '22px' }}>
            <div className="ui items">{review}</div>
          </div>
          {comments}
        </div>
      </div>
    );
  }
}

export default Review;
