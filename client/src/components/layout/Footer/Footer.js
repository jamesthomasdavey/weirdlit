import React from 'react';
import classes from './Footer.module.css';

export default () => {
  return (
    <footer className={classes.footer}>
      <span className={classes.footer__text}>&copy; {new Date().getFullYear()} WeirdLit</span>
    </footer>
  );
};
