// package
import React from 'react';
import { Link } from 'react-router-dom';

// css
import classes from './Random.module.css';

const Random = () => {
  return (
    <div className={classes.wrapper}>
      <h4 className="ui dividing center aligned header">Random</h4>
      <Link to="/books/random" className="ui button blue tiny">
        Random Book
      </Link>
    </div>
  );
};

export default Random;
