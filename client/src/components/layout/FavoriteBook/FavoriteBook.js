// package
import React from 'react';
import PropTypes from 'prop-types';

// css
import classes from './FavoriteBook.module.css';

const FavoriteBook = props => {
  return (
    <div>
      <span className={['ui large label', classes.FavoriteBook].join(' ')}>
        {props.title}
        <i className="ui delete icon" onClick={props.removeFavoriteBookHandler} />
      </span>
    </div>
  );
};

FavoriteBook.propTypes = {
  title: PropTypes.string.isRequired,
  removeFavoriteBookHandler: PropTypes.func.isRequired
};

export default FavoriteBook;
