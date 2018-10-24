import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import classes from './Navbar.module.css';

class Navbar extends Component {
  render() {
    return (
      <nav className={classes.nav}>
        <div className={classes.nav__container}>
          <Link className={classes.logo__link} to="/">
            <h1 className={classes.logo}>
              <span className={classes.logo__weird}>WEIRD</span>
              <span className={classes.logo__lit}>LIT</span>
            </h1>
          </Link>
        </div>
      </nav>
    );
  }
}

export default Navbar;
