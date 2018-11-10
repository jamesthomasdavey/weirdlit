// package
import React from 'react';
import PropTypes from 'prop-types';

// component
import ReadButton from './ReadButton/ReadButton';

const Heading = props => {
  return (
    <div>
      <ReadButton bookId={props.book._id} />
    </div>
  );
};

Heading.propTypes = {
  book: PropTypes.object.isRequired
};

export default Heading;
