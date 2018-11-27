// package
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

// component
import BookThumb from './../../../../layout/BookThumb/BookThumb';

// css
import classes from './BooksWritten.module.css';

class BooksWritten extends Component {
  state = {
    books: [],
    isLoading: true
  };

  componentDidMount = () => {
    axios.get(`/api/authors/${this.props.authorId}/books`).then(res => {
      this.setState({ books: res.data, isLoading: false });
    });
  };
  render() {
    const numberOfBooksToDisplay = 6;
    let booksWrittenContent;

    if (!this.state.isLoading) {
      const randomizedBooks = [...this.state.books]
        .sort(() => Math.random() - 0.5)
        .splice(0, numberOfBooksToDisplay);

      booksWrittenContent = randomizedBooks.map(book => <BookThumb book={book} key={book._id} />);
    }

    return (
      <Fragment>
        <h5 className="ui horizontal divider header">
          <i className="book icon" />
          Weird Books by {this.props.authorName}
        </h5>
        <div className={['ui raised segment', this.state.isLoading ? 'loading' : ''].join(' ')}>
          <div className={classes.books__wrapper}>{booksWrittenContent}</div>
          {this.state.books.length > numberOfBooksToDisplay && (
            <div style={{ textAlign: 'center' }}>
              <Link
                to={`/authors/${this.props.authorId}/books`}
                className="ui tiny button"
                style={{ marginTop: '16px' }}
              >
                View All
              </Link>
            </div>
          )}
        </div>
      </Fragment>
    );
  }
}

BooksWritten.propTypes = {
  authorId: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired
};

export default BooksWritten;
