// package
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const BooksRead = props => {
  let booksReadContent;
  const numberOfBooksToDisplay = 8;
  const randomizedBooks = [...props.books]
    .sort(() => Math.random() - 0.5)
    .splice(0, numberOfBooksToDisplay);

  if (props.books.length > 0) {
    booksReadContent = randomizedBooks.map(book => (
      <div className="ui tiny image">
        <img src={book.image.mediumThumbnail} alt={book.title} />
      </div>
    ));
    return (
      <Fragment>
        <h5 className="ui horizontal divider header">
          <i className="book icon" />
          Books Read
        </h5>
        <div className="ui raised segment">{booksReadContent}</div>
      </Fragment>
    );
  }
};

BooksRead.propTypes = {
  books: PropTypes.array.isRequired
};

export default BooksRead;
