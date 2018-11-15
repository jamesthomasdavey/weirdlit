// package
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// css
import classes from './Tag.module.css';

const Tag = props => {
  return (
    <Link
      to={`/books/filter/${props.name}`}
      className={['ui label grey tiny', classes.tag].join(' ')}
    >
      {props.name}
    </Link>
  );
};

Tag.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

export default Tag;
