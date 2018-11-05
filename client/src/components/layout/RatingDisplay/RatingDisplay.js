// package
import React from 'react';
import PropTypes from 'prop-types';

// css
import classes from './RatingDisplay.module.css';

const RatingDisplay = props => {
  const rating = Number(props.rating).toFixed(2);
  const percentage = parseInt((rating / 5) * 100);
  return (
    <div className={classes.wrapper}>
      <div className={classes.rating__mask} />
      <div className={classes.rating__fill} style={{ width: `${percentage}%` }} />
      <div className={classes.rating__background} />
    </div>
  );
};

RatingDisplay.propTypes = {
  rating: PropTypes.number.isRequired
};

export default RatingDisplay;
