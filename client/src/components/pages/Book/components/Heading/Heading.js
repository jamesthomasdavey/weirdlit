// package
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// component
import ReadButton from './ReadButton/ReadButton';
import Description from './Description/Description';

// css
import classes from './Heading.module.css';

const Heading = props => {
  return (
    <Fragment>
      <div className={classes.wrapper}>
        <div className={classes.backdrop__cover} />
        <div
          className={classes.backdrop}
          style={{ backgroundImage: `url(${props.book.image.original})` }}
        />
        <div className={['ui container', classes.container].join(' ')}>
          <div className={classes.content__wrapper}>
            <div
              className={classes.image}
              style={{ backgroundImage: `url(${props.book.image.largeThumbnail})` }}
            />
            <div className={classes.info__wrapper}>
              <div className={classes.info} />
              <ReadButton bookId={props.book._id} />
            </div>
          </div>
        </div>
        <Description description={props.book.description} />
      </div>
    </Fragment>
  );
};

Heading.propTypes = {
  book: PropTypes.object.isRequired
};

export default Heading;
