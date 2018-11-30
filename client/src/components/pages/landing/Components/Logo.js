// package
import React from 'react';
import { Link } from 'react-router-dom';

// css
import classes from './../WelcomePage.module.css';

const Logo = () => {
  return (
    <div className={classes.content__logo}>
      <Link to="/browse">
        <span className={[classes['content__logo-text'], classes.text__weird].join(' ')}>
          Weird
        </span>
        <span className={[classes['content__logo-text'], classes.text__lit].join(' ')}>Li</span>
      </Link>
    </div>
  );
};

export default Logo;
