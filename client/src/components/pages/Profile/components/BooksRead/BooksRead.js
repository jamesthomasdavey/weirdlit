// package
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// component
import BookThumb from './../../../../layout/BookThumb/BookThumb';

// css
import classes from './BooksRead.module.css';

const BooksRead = props => {
  if (props.books.length > 0) {
    const numberOfBooksToDisplay = 6;
    const randomizedBooks = [...props.books]
      .sort(() => Math.random() - 0.5)
      .splice(0, numberOfBooksToDisplay);

    let booksReadContent = randomizedBooks.map(book => <BookThumb book={book} key={book._id} />);
    return (
      <Fragment>
        <h5 className="ui horizontal divider header">
          <i className="book icon" />
          Books Read
        </h5>
        <div className="ui raised segment">
          <div className={classes.books__wrapper}>{booksReadContent}</div>
          {props.books.length > numberOfBooksToDisplay && (
            <div style={{ textAlign: 'center' }}>
              <Link
                to={`/profile/user/${props.userId}/books`}
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
  } else {
    return <Fragment />;
  }
};

BooksRead.propTypes = {
  books: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired
};

export default BooksRead;
