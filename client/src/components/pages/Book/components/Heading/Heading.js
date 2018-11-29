// package
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// component
import ReadButton from './ReadButton/ReadButton';
import Description from './Description/Description';
import AuthorLinks from './../../../../layout/AuthorLinks/AuthorLinks';
import Tags from './Tags/Tags';

// image
import amazonIcon from './../../../../../img/icons/amazon.svg';
import goodreadsIcon from './../../../../../img/icons/goodreads.svg';

// css
import classes from './Heading.module.css';

const Heading = props => {
  return (
    <Fragment>
      <div className={classes.wrapper}>
        <div className={classes.backdrop__cover} />
        <div
          className={classes.backdrop}
          style={{ backgroundImage: `url(${props.book.image.original})` }}
        />
        <div className={['ui container', classes.container].join(' ')}>
          {props.auth.user.isAdmin && (
            <Link
              to={`/books/${props.book._id}/edit`}
              className={['ui tiny button', classes.edit__button].join(' ')}
            >
              Edit
            </Link>
          )}
          <div className={classes.content__wrapper}>
            <div
              className={classes.image}
              style={{ backgroundImage: `url(${props.book.image.largeThumbnail})` }}
            />
            <div className={classes.info__wrapper}>
              <div className={classes.info}>
                <div className={classes.info__heading}>
                  {props.book.title && (
                    <div className={classes['info__book-title']}>{props.book.title}</div>
                  )}
                  {props.book.subtitle && (
                    <div className={classes['info__book-subtitle']}>{props.book.subtitle}</div>
                  )}
                </div>
                <div className={classes.info__authors}>
                  <AuthorLinks authors={props.book.authors} inverted />
                </div>
                <div className={classes['info__published-date']}>
                  {new Date(props.book.publishedDate).getFullYear()}
                </div>
                <div className={classes.info__tags}>
                  <Tags tags={props.book.tags} />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  {props.book.social.amazon && (
                    <a
                      href={props.book.social.amazon}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={['ui mini icon labeled button', classes.amazonIcon].join(' ')}
                    >
                      <i className="amazon icon" />
                      Amazon
                    </a>
                  )}
                  {props.book.social.goodreads && (
                    <a
                      href={props.book.social.goodreads}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={['ui mini icon labeled button', classes.goodreadsIcon].join(' ')}
                    >
                      <i className="goodreads icon" />
                      Goodreads
                    </a>
                  )}
                </div>
                <ReadButton bookId={props.book._id} />
              </div>
            </div>
          </div>
        </div>
        <Description description={props.book.description} />
      </div>
    </Fragment>
  );
};

Heading.propTypes = {
  book: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(Heading);
