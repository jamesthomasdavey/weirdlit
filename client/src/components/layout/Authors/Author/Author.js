// package
import React from 'react';
import PropTypes from 'prop-types';

// css
import classes from './Author.module.css'

const Author = props => {
  return (
    <span className={["ui large label", classes.author].join(" ")}>
      {props.name}
      <i className="ui delete icon" onClick={() => props.removeAuthorHandler(props.name)}/>
    </span>
  );
};

Author.propTypes = {
  name: PropTypes.string.isRequired,
  removeAuthorHandler: PropTypes.func.isRequired
};

export default Author;
