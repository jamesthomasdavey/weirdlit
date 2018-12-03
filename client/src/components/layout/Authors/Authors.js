// package
import React from 'react';
import PropTypes from 'prop-types';

// component
import Author from './Author/Author';

const Authors = props => {
  const authors = props.names.map(name => {
    return (
      <Author
        key={name + '_authorPageHeader'}
        name={name}
        removeAuthorHandler={props.removeAuthorHandler}
      />
    );
  });
  return <div>{authors}</div>;
};

Authors.propTypes = {
  names: PropTypes.array.isRequired,
  removeAuthorHandler: PropTypes.func.isRequired
};

export default Authors;
