// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// component
import StarRating from './../StarRating/StarRating';
import AuthorLinks from './../AuthorLinks/AuthorLinks';
import BookThumb from './components/BookThumb/BookThumb';

// css
import classes from './BookCard.module.css';

class BookCard extends Component {
  state = {};
  render() {
    let rating;
    let authors;
    let publishedDate;

    if (this.props.showRating) {
      // if (this.props.book.ratingDisplay) {
      rating = (
        <div className={classes.rating}>
          <StarRating center value={this.props.book.rating} />
        </div>
      );
      // }
    }

    if (this.props.showAuthors) {
      authors = (
        <div className={classes.authors}>
          <AuthorLinks authors={this.props.book.authors} />
        </div>
      );
    }

    if (this.props.showPublishedDate) {
      publishedDate = (
        <div className={classes.publishedDate}>
          {new Date(this.props.book.publishedDate).getFullYear()}
        </div>
      );
    }

    return (
      <div className={classes.wrapper}>
        <div>
          <div className={classes.imageWrapper}>
            <BookThumb book={this.props.book} />
          </div>
          <div className={classes.info}>
            <h3 className={classes.title}>{this.props.book.title}</h3>
            {rating}
            {authors}
            {publishedDate}
            <div className={classes.viewButton}>
              <Link to={`/books/${this.props.book._id}`} className="ui tiny primary button">
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BookCard.propTypes = {
  book: PropTypes.object.isRequired,
  currentAuthor: PropTypes.object
};

BookCard.defaultProps = {
  showRating: false,
  showAuthors: false,
  showPublishedDate: false
};

export default BookCard;
