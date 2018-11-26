// package
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Heading = props => {
  return (
    <Fragment>
      <div style={{ paddingBottom: '16px' }}>
        <h2>{props.name}</h2>
        {props.isAdmin && (
          <Link
            to={`/authors/${props.id}/edit`}
            className="ui right floated button tiny icon labeled"
          >
            <i className="edit icon" />
            Edit Author
          </Link>
        )}
      </div>
    </Fragment>
  );
};

Heading.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

export default Heading;
