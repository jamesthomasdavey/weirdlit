// package
import React from 'react';
import PropTypes from 'prop-types';

// css
import classes from './Tags.module.css';

const Tags = props => {
  const tags = props.tags.map(tag => {
    if (tag.isDisabled && !tag.isSelected) {
      return (
        <span
          key={tag._id + '_filterTagDisabled'}
          className={['ui label disabled', classes.tag].join(' ')}
        >
          {tag.name}
        </span>
      );
    } else {
      return (
        <span
          key={tag._id + '_filterTagEnabled'}
          className={['ui label', tag.isSelected && 'blue', classes.enabled, classes.tag].join(' ')}
          onClick={() => props.toggleSelectedHandler(tag.name)}
        >
          {tag.name}
        </span>
      );
    }
  });
  return <div className={classes.wrapper}>{tags}</div>;
};

Tags.propTypes = {
  tags: PropTypes.array.isRequired,
  toggleSelectedHandler: PropTypes.func.isRequired
};

export default Tags;
