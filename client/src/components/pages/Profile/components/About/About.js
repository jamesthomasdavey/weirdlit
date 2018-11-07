// package
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import arrayToSentence from 'array-to-sentence';

// image
import goodreadsIcon from './../../../../../img/icons/goodreads.svg';
import facebookIcon from './../../../../../img/icons/facebook.svg';
import instagramIcon from './../../../../../img/icons/instagram.svg';

// css
import classes from './About.module.css';

const About = props => {
  let favoriteBook, favoriteBookObj, location, bio, social;
  if (props.favoriteBookObj._id) {
    favoriteBookObj = (
      <div className="column">
        <h5>Favorite Book</h5>
        <div className="ui items">
          <div className="ui item">
            <div className="ui small image">
              <img
                src={props.favoriteBookObj.image.largeThumbnail}
                className="book__image"
                alt={props.favoriteBookObj.title}
                onClick={() => props.history.push(`/books/${props.favoriteBookObj._id}`)}
              />
            </div>
            <div className="content">
              <div className="header">{props.favoriteBookObj.title}</div>
              <div className="meta">{props.favoriteBookObj.publishedDate}</div>
              {props.favoriteBookObj.authors.length > 0 && (
                <div className="meta">
                  {arrayToSentence(props.favoriteBookObj.authors, { lastSeparator: ' & ' })}
                </div>
              )}
              {props.favoriteBookObj.description && (
                <div className="description">{props.favoriteBookObj.description}</div>
              )}
              <Link to={`/books/${props.favoriteBookObj._id}`} className="button ui">
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (props.favoriteBook) {
    favoriteBook = (
      <Fragment>
        <h5>Favorite Book</h5>
        <span>{props.favoriteBook}</span>
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
            className={['ui stackable', favoriteBookObj ? 'two' : 'one', 'column grid'].join(' ')}
          >
            {favoriteBookObj}
            <div className="column">
              {favoriteBook}
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
  favoriteBook: PropTypes.string,
  favoriteBookObj: PropTypes.object,
  location: PropTypes.string,
  bio: PropTypes.string,
  social: PropTypes.object
};

export default About;
