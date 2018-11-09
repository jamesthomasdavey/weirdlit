// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import timeAgo from 'time-ago';

// component
import StarRating from '../../../../../layout/StarRating/StarRating';

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
    let reviewText;
    const maxCharsToDisplay = 600;

    if (this.state.displayFullReview) {
      reviewText = this.props.text;
    } else {
      const shortenedTextArray = this.props.text.substring(0, maxCharsToDisplay).split(' ');
      const shortenedText =
        shortenedTextArray.splice(0, shortenedTextArray.length - 1).join(' ') + '...';
      reviewText = shortenedText;
    }

    return (
      <div className="ui item">
        <div className="content">
          <div className="header">{this.props.headline}</div>
          <div className="meta">
            <span>
              Posted {timeAgo.ago(this.props.date)} by{' '}
              <Link to={`/profile/user/${this.props.creator._id}`}>{this.props.creator.name}</Link>
            </span>
          </div>
          <div className="meta">
            <StarRating value={Number(this.props.rating)} />
          </div>
          <p className={classes.review__text}>
            {reviewText.split('\n').map((item, key) => {
              return (
                <span key={key}>
                  {item}
                  <br />
                </span>
              );
            })}
          </p>
          <div>
            {this.props.lastUpdated && (
              <span className={classes.last__updated}>
                Last updated {timeAgo.ago(this.props.lastUpdated)}
              </span>
            )}
            {this.props.text.length > maxCharsToDisplay && (
              <span onClick={this.toggleDisplayFullReview} className={classes.show__toggle}>
                {this.state.displayFullReview ? 'Show less' : 'Show more'}
              </span>
            )}
          </div>
          <div className="meta" />
        </div>
      </div>
    );
  }
}

Review.propTypes = {
  history: PropTypes.object.isRequired,
  headline: PropTypes.string.isRequired,
  creator: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  lastUpdated: PropTypes.string
};

export default Review;
