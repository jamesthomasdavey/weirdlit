// package
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// component
import BookCard from './../../../../layout/BookCard/BookCard';

// css
import classes from './BooksRead.module.css';

const BooksRead = props => {
  if (props.books.length > 0) {
    const numberOfBooksToDisplay = 8;
    const randomizedBooks = [...props.books]
      .sort(() => Math.random() - 0.5)
      .splice(0, numberOfBooksToDisplay);

    let booksReadContent = randomizedBooks.map(book => (
      <BookCard book={book} history={props.history} key={book._id} />
    ));
    return (
      <Fragment>
        <h5 className="ui horizontal divider header">
          <i className="book icon" />
          Books Read
        </h5>
        <div className="ui raised segment">
          <div className={classes.books__wrapper}>{booksReadContent}</div>
        </div>
      </Fragment>
    );
  } else {
    return <Fragment />;
  }
};

BooksRead.propTypes = {
  books: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired
};

export default BooksRead;
