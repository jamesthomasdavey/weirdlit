// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

// component
import ReviewSortBar from './../../../../layout/ReviewSortBar/ReviewSortBar';
import AuthorLinks from './../../../../layout/AuthorLinks/AuthorLinks';

// css
import classes from './BookReviewsHeader.module.css';

class BookReviewsHeader extends Component {
  state = {
    bookTitle: '',
    authors: [],
    isLoading: true
  };
  componentDidMount = () => {
    axios.get(`/api/books/${this.props.bookId}`).then(res => {
      this.setState({ bookTitle: res.data.title, authors: res.data.authors, isLoading: false });
    });
  };
  render() {
    let bookLink;
    let reviewSortBar;

    if (!this.state.isLoading) {
      reviewSortBar = (
        <ReviewSortBar
          sort={this.props.sort}
          sortMethodHandler={this.props.sortMethodHandler}
          toggleSortOrderHandler={this.props.toggleSortOrderHandler}
        />
      );
    }

    if (!this.state.isLoading) {
      bookLink = <Link to={`/books/${this.props.bookId}`}>{this.state.bookTitle}</Link>;
      document.title = `Reviews for ${this.state.bookTitle} | WeirdLit`;
    }

    return (
      <div style={{ width: '100%', padding: '12px' }}>
        {!this.state.isLoading && (
          <h3 className={['ui dividing header', classes.h3Wrapper].join(' ')}>
            <span>
              Reviews for {bookLink}{' '}
              <span style={{ fontSize: '14px', fontWeight: 'normal' }}>
                by <AuthorLinks authors={this.state.authors} />
              </span>
            </span>
            {reviewSortBar}
          </h3>
        )}
      </div>
    );
  }
}

BookReviewsHeader.propTypes = {
  bookId: PropTypes.string.isRequired,
  sort: PropTypes.object.isRequired,
  sortMethodHandler: PropTypes.func.isRequired,
  toggleSortOrderHandler: PropTypes.func.isRequired
};

export default BookReviewsHeader;
