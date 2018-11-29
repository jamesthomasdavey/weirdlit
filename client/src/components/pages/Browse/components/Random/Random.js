// package
import React from 'react';
import { Link } from 'react-router-dom';

// css
import classes from './Random.module.css';

const Random = () => {
  return (
    <div className={classes.wrapper}>
      <Link to="/books/random" className="ui button blue tiny">
        Random Book
      </Link>
    </div>
  );
};

export default Random;
