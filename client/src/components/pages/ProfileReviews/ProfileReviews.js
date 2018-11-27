// package
import React, { Component, Fragment } from 'react';
import axios from 'axios';

// component
import Spinner from './../../layout/Spinner/Spinner';
import Review from './../../layout/Review/Review';
import ProfileReviewsHeader from './components/ProfileReviewsHeader/ProfileReviewsHeader';

class ProfileReviews extends Component {
  state = {
    reviewsOnDisplay: [],
    totalAvailable: '',
    sort: {
      sortMethod: '',
      sortOrder: ''
    },
    isLoading: true,
    isLoadingReviews: false,
    isLoadingMore: false
  };
  componentDidMount = () => {
    this.updateSort();
  };
  updateSort = () => {
    let sort = {};
    if (!this.props.match.params.sortMethod) {
      sort.sortMethod = 'writtenDate';
    } else {
      sort.sortMethod = this.props.match.params.sortMethod;
    }
    if (!this.props.match.params.sortOrder) {
      sort.sortOrder = 'desc';
    } else {
      sort.sortOrder = this.props.match.params.sortOrder;
    }
    this.setState({ sort }, this.updateUrl);
  };
  updateUrl = () => {
    if (
      this.state.sort.sortMethod === 'writtenDate' ||
      this.state.sort.sortMethod === 'rating' ||
      this.state.sort.sortMethod === 'length'
    ) {
      if (this.state.sort.sortOrder === 'asc' || this.state.sort.sortOrder === 'desc') {
        window.history.pushState(
          '',
          '',
          `/profile/user/${this.props.match.params.userId}/reviews/sort/${
            this.state.sort.sortMethod
          }/${this.state.sort.sortOrder}`
        );
        this.updateFromReviews();
      } else {
        this.props.history.push('/404');
      }
    } else {
      this.props.history.push('/404');
    }
  };
  updateFromReviews = () => {
    axios
      .get(
        `/api/profile/user/${this.props.match.params.userId}/reviews/sort/${
          this.state.sort.sortMethod
        }/${this.state.sort.sortOrder}/skip/0`
      )
      .then(res => {
        this.setState({
          reviewsOnDisplay: res.data.reviews,
          totalAvailable: res.data.totalAvailable,
          isLoading: false,
          isLoadingReviews: false,
          isLoadingMore: false
        });
      });
  };
  sortMethodHandler = sortMethod => {
    const currentState = this.state;
    currentState.sort.sortMethod = sortMethod;
    currentState.isLoadingReviews = true;
    this.setState(currentState, this.updateUrl);
  };
  toggleSortOrderHandler = () => {
    const currentState = this.state;
    currentState.sort.sortOrder = this.state.sort.sortOrder === 'desc' ? 'asc' : 'desc';
    currentState.isLoadingReviews = true;
    this.setState(currentState, this.updateUrl);
  };
  showMoreReviewsHandler = () => {
    this.setState({ isLoadingMore: true }, () => {
      axios.get(
        `/api/profile/user/${this.props.match.params.userId}/reviews/sort/${
          this.state.sort.sortMethod
        }/${this.state.sortOrder}/skip/${this.state.reviewsOnDisplay.length}`
      );
    }).then(res => {
      const currentReviewsOnDisplay = this.state;
      const newReviewsToDisplay = res.data.reviews;
      const reviews = [...currentReviewsOnDisplay, ...newReviewsToDisplay];
      this.setState({
        reviewsOnDisplay: reviews,
        totalAvailable: res.data.totalAvailable,
        isLoading: false,
        isLoadingMore: false
      });
    });
  };
  render() {
    let reviews;
    let profileReviewsHeader;

    if (this.state.isLoading || this.state.isLoadingReviews) {
      reviews = <Spinner />;
    } else {
      if (this.state.reviewsOnDisplay.length > 0) {
        reviews = this.state.reviewsOnDisplay.map(review => {
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
              showLastUpdated
            />
          );
        });
      }
    }

    if (!this.state.isLoading) {
      profileReviewsHeader = (
        <ProfileReviewsHeader
          userId={this.props.match.params.userId}
          sort={this.state.sort}
          sortMethodHandler={this.sortMethodHandler}
          toggleSortOrderHandler={this.toggleSortOrderHandler}
        />
      );
    }

    return (
      <Fragment>
        <div className="ui container">
          <div className="ui segment">
            {profileReviewsHeader}
            <div className="ui divided items" style={{ padding: '0 12px' }}>
              {reviews}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default ProfileReviews;
