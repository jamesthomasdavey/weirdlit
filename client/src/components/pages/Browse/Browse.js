import React, { Component, Fragment } from 'react';

import Navbar from './../../layout/Navbar/Navbar';

class Browse extends Component {
  render() {
    document.title = 'Browse | WeirdLit';
    return (
      <Fragment>
        <Navbar />
      </Fragment>
    );
  }
}

export default Browse;