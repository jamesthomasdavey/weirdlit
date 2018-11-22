// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// css
import classes from './BookThumb.module.css';

class BookThumb extends Component {
  state = {
    isHoveredOver: false
  };
  addHoverHandler = () => {
    this.setState({ isHoveredOver: true });
  };
  removeHoverHandler = () => {
    this.setState({ isHoveredOver: false });
  };
  render() {
    return (
      <Link
        to={`/books/${this.props.book._id}`}
        className={classes.wrapper}
        onMouseEnter={this.addHoverHandler}
        onMouseLeave={this.removeHoverHandler}
      >
        {/* <div
          className={[
            classes['book__cover-top'],
            this.state.isHoveredOver ? classes['book__cover-top-hover'] : ''
          ].join(' ')}
        /> */}
        <img alt="cover" src={this.props.book.image.largeThumbnail} className={classes.bookCover} />
      </Link>
    );
  }
}

BookThumb.propTypes = {
  book: PropTypes.object.isRequired
};

export default BookThumb;
