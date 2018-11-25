// package
import React from 'react';
import PropTypes from 'prop-types';

// css
import classes from './Tags.module.css';

const Tags = props => {
  const tags = props.tags.map(tag => {
    return (
      <span
        key={tag._id}
        className={['ui label', tag.isSelected && 'blue', classes.tag].join(' ')}
        onClick={() => props.toggleSelectedHandler(tag.name)}
      >
        {tag.name}
      </span>
    );
  });
  return <div className={classes.wrapper}>{tags}</div>;
};

Tags.propTypes = {
  tags: PropTypes.array.isRequired,
  toggleSelectedHandler: PropTypes.func.isRequired
};

export default Tags;
