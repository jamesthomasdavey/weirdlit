// package
import React from 'react';
import PropTypes from 'prop-types';

// css
import classes from './Tag.module.css';

const Tag = props => {
  return (
    <span
      className={['ui label', props.selected && 'blue', classes.tag].join(' ')}
      onClick={() => props.toggleSelectTagHandler(props.id)}
    >
      {props.name}
    </span>
  );
};

Tag.propTypes = {
  selected: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  toggleSelectTagHandler: PropTypes.func.isRequired
};

export default Tag;
