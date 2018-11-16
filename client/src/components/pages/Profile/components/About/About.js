// package
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

// component
import FavoriteBookObj from './FavoriteBookObj/FavoriteBookObj';

// image
import goodreadsIcon from './../../../../../img/icons/goodreads.svg';
import twitterIcon from './../../../../../img/icons/twitter.svg';
import facebookIcon from './../../../../../img/icons/facebook.svg';
import instagramIcon from './../../../../../img/icons/instagram.svg';

// css
import classes from './About.module.css';

const About = props => {
  let favoriteBook, location, bio, social;
  if (props.favoriteBook.title) {
    favoriteBook = (
      <Fragment>
        <h5>Favorite Book</h5>
        <span>{props.favoriteBook.title}</span>
      </Fragment>
    );
  }
  if (props.location) {
    location = (
      <Fragment>
        <h5>Location</h5>
        <span>{props.location}</span>
      </Fragment>
    );
  }
  if (props.bio) {
    bio = (
      <Fragment>
        <h5>Bio</h5>
        <p>
          {props.bio.split('\n').map((item, key) => {
            return (
              <span key={key}>
                {item}
                <br />
              </span>
            );
          })}
        </p>
      </Fragment>
    );
  }
  if (props.social.goodreads || props.social.facebook || props.social.instagram) {
    social = (
      <Fragment>
        <h5>Social</h5>
        <div>
          {props.social.goodreads && (
            <Fragment>
              <a href={props.social.goodreads} target="_blank" rel="noopener noreferrer">
                <img className={classes.social__icon} alt="goodreads" src={goodreadsIcon} />
              </a>
            </Fragment>
          )}
          {props.social.twitter && (
            <Fragment>
              <a href={props.social.twitter} target="_blank" rel="noopener noreferrer">
                <img className={classes.social__icon} alt="twitter" src={twitterIcon} />
              </a>
            </Fragment>
          )}
          {props.social.facebook && (
            <Fragment>
              <a href={props.social.facebook} target="_blank" rel="noopener noreferrer">
                <img className={classes.social__icon} alt="facebook" src={facebookIcon} />
              </a>
            </Fragment>
          )}
          {props.social.instagram && (
            <a href={props.social.instagram} target="_blank" rel="noopener noreferrer">
              <img className={classes.social__icon} alt="instagram" src={instagramIcon} />
            </a>
          )}
        </div>
      </Fragment>
    );
  }
  if (favoriteBook || location || bio || social) {
    return (
      <Fragment>
        <h5 className="ui horizontal divider header">
          <i className="user icon" />
          About
        </h5>
        <div className="ui raised segment" style={{ padding: '22px' }}>
          <div
            className={['ui stackable', props.favoriteBook.id ? 'two' : 'one', 'column grid'].join(
              ' '
            )}
          >
            {props.favoriteBook.id && <FavoriteBookObj bookId={props.favoriteBook.id} />}
            <div className="column">
              {!props.favoriteBook.id && favoriteBook}
              {location}
              {bio}
              {social}
            </div>
          </div>
        </div>
      </Fragment>
    );
  } else {
    return <Fragment />;
  }
};

About.propTypes = {
  favoriteBook: PropTypes.object.isRequired,
  location: PropTypes.string,
  bio: PropTypes.string,
  social: PropTypes.object
};

export default About;
