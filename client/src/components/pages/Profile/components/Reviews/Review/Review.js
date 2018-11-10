// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import timeAgo from 'time-ago';
import arrayToSentence from 'array-to-sentence';

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
        <div className="ui tiny image">
          <img
            alt="cover"
            className="book__image"
            src={this.props.book.image.mediumThumbnail}
            onClick={() => this.props.history.push(`/books/${this.props.book._id}`)}
          />
        </div>
        <div className="content">
          <div className="header">{this.props.headline}</div>
          <div className="meta">
            <span>
              <Link className="meta" to={`/books/${this.props.book._id}`}>
                <strong>{this.props.book.title}</strong>
              </Link>
              {'by '}
              {arrayToSentence(
                this.props.book.authors.map(author => (
                  <Link to={`/authors/${author._id}`}>{author.name}</Link>
                )),
                {
                  lastSeparator: ' & '
                }
              )}
            </span>
          </div>
          <div className="meta">
            <span>Posted {timeAgo.ago(this.props.date)}</span>
            <StarRating value={Number(this.props.rating)} />
          </div>
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
  book: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  headline: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  lastUpdated: PropTypes.string
};

export default Review;
