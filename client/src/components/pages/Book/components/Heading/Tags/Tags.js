// package
import React from 'react';
import PropTypes from 'prop-types';

// component
import Tag from './Tag/Tag';

// css
import classes from './Tags.module.css';

const Tags = props => {
  const tags = props.tags
    .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
    .map(tag => {
      return <Tag name={tag.name} key={tag._id} id={tag._id} />;
    });
  return <div className={classes.tags}>{tags}</div>;
};

Tags.propTypes = {
  tags: PropTypes.array.isRequired
};

export default Tags;
