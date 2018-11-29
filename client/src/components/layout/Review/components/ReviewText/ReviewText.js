// package
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

// css
import classes from './ReviewText.module.css';

class ReviewText extends Component {
  state = {
    isShortReview: false,
    showFull: false
  };
  componentDidMount = () => {
    if (this.props.review.length > this.props.maxChars) {
      this.setState({ isShortReview: false });
    } else {
      this.setState({ isShortReview: true });
    }
  };
  toggleShowFullHandler = () => {
    this.setState({ showFull: !this.state.showFull });
  };
  render() {
    if (this.state.isShortReview || this.props.showAll) {
      return (
        <p>
          {this.props.review.split('\n').map((item, key) => {
            return (
              <span key={key}>
                {item}
                <br />
              </span>
            );
          })}
        </p>
      );
    } else {
      let review;
      let showFullButton;
      if (this.state.showFull) {
        review = (
          <p>
            {this.props.review.split('\n').map((item, key) => {
              return (
                <span key={key}>
                  {item}
                  <br />
                </span>
              );
            })}
          </p>
        );
      } else {
        const shortenedReviewArray = this.props.review.substring(0, this.props.maxChars).split(' ');
        const shortenedReview =
          shortenedReviewArray.splice(0, shortenedReviewArray.length - 1).join(' ') + '...';
        review = (
          <p>
            {shortenedReview.split('\n').map((item, key) => {
              return (
                <span key={key}>
                  {item}
                  <br />
                </span>
              );
            })}
          </p>
        );
      }
      showFullButton = (
        <div className={classes.show__wrapper} onClick={this.toggleShowFullHandler}>
          <span className={classes['show-full__button']}>
            {!this.state.showFull ? 'Show more' : 'Show less'}
          </span>
        </div>
      );
      return (
        <Fragment>
          {review}
          {showFullButton}
        </Fragment>
      );
    }
  }
}

ReviewText.propTypes = {
  showAll: PropTypes.bool.isRequired,
  review: PropTypes.string.isRequired,
  maxChars: PropTypes.number.isRequired
};

ReviewText.defaultProps = {
  showAll: false,
  maxChars: 600
};

export default ReviewText;
