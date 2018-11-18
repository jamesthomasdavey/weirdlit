import React from 'react';
import PropTypes from 'prop-types';

import BookObj from './../../../../../layout/BookObj/BookObj';

const FavoriteBookObj = props => {
  return (
    <div className="column">
      <h5>Favorite Book</h5>
      <BookObj bookId={props.bookId} />
    </div>
  );
};

FavoriteBookObj.propTypes = {
  bookId: PropTypes.string.isRequired
};

export default FavoriteBookObj;
