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
        <div>
          <div
            className={[
              classes['book__cover-top'],
              this.state.isHoveredOver ? classes['book__cover-top-hover'] : ''
            ].join(' ')}
          />
          <div className={classes['book__cover-title']}>
            <span
              className={[
                classes['book__cover-title-text'],
                this.state.isHoveredOver ? classes['book__cover-title-text-hover'] : ''
              ].join(' ')}
            >
              {this.props.book.title}
            </span>
          </div>
          <div
            style={{
              backgroundImage: `url('${this.props.book.image.mediumThumbnail}')`
            }}
            className={classes['book__cover-image']}
          />
        </div>
      </Link>
    );
  }
}

BookThumb.propTypes = {
  book: PropTypes.object.isRequired
};

export default BookThumb;
