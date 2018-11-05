// package
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// css
import classes from './BookCard.module.css';

class BookCard extends Component {
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
      <div
        className={classes.wrapper}
        onMouseEnter={this.addHoverHandler}
        onMouseLeave={this.removeHoverHandler}
        onClick={() => this.props.history.push(`/books/${this.props.book._id}`)}
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
              backgroundImage: `url(${this.props.book.image.mediumThumbnail})`
            }}
            className={classes['book__cover-image']}
          />
        </div>
      </div>
    );
  }
}

BookCard.propTypes = {
  book: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default BookCard;
