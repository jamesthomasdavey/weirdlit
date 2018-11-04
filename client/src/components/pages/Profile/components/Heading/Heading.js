// package
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Heading = props => {
  const date = new Date(props.date);
  return (
    <Fragment>
      <h2>{props.name}</h2>
      <span style={{ color: '#888' }}>
        User since {date.toLocaleString('en-us', { month: 'long' })} {date.getFullYear()}
      </span>
      {props.isCurrentUser && (
        <Link to="/profile/edit" className="ui right floated button tiny">
          Edit Profile
        </Link>
      )}
    </Fragment>
  );
};

Heading.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  isCurrentUser: PropTypes.bool
};

export default Heading;
