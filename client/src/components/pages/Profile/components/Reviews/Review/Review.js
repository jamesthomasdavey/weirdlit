// package
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import timeAgo from 'time-ago';
import arrayToSentence from 'array-to-sentence';

// component
import RatingDisplay from '../../../../../layout/RatingDisplay/RatingDisplay';

const Review = props => {
  return (
    <div className="ui item">
      <div className="ui tiny image">
        <img
          alt="cover"
          className="book__image"
          src={props.book.image.mediumThumbnail}
          onClick={() => props.history.push(`/books/${props.book._id}`)}
        />
      </div>
      <div className="content">
        <div className="header">{props.headline}</div>
        <div className="meta">
          <span>
            <Link className="meta" to={`/books/${props.book._id}`}>
              <strong>{props.book.title}</strong>
            </Link>
            {' by '}
            {arrayToSentence(props.book.authors.map(author => author.name), {
              lastSeparator: ' & '
            })}
          </span>
        </div>
        <div className="meta">
          <span>Posted {timeAgo.ago(props.date)}</span>
          <RatingDisplay rating={props.rating} />
        </div>
        <p>{props.text}</p>
        {props.lastUpdated && (
          <div className="meta" style={{ color: '#ccc' }}>
            Last updated {timeAgo.ago(props.lastUpdated)}
          </div>
        )}
        <div className="meta" />
      </div>
    </div>
  );
};

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
