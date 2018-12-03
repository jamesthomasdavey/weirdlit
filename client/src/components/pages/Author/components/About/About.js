// package
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// component
import LatestBook from './LatestBook/LatestBook';

const About = props => {
  let bio, website;

  if (props.bio) {
    bio = (
      <Fragment>
        <h5>Bio</h5>
        <p>
          {props.bio.split('\n').map((item, key) => {
            return (
              <span key={key + '_bioKey'}>
                {item}
                <br />
              </span>
            );
          })}
        </p>
      </Fragment>
    );
  }

  if (props.website) {
    website = (
      <p>
        <a href={props.website} target="_blank" rel="noopener noreferrer">
          Website
        </a>
      </p>
    );
  }

  return (
    <Fragment>
      <h5 className="ui horizontal divider header">
        <i className="user icon" />
        About
      </h5>
      <div className="ui raised segment" style={{ padding: '22px' }}>
        <div className="ui stackable two column grid">
          <LatestBook authorId={props.authorId} />
          <div className="column">
            {bio}
            {website}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

About.propTypes = {
  authorId: PropTypes.string.isRequired,
  bio: PropTypes.string,
  website: PropTypes.string
};

export default About;
