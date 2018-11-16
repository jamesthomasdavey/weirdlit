// package
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// css
import classes from './AuthorLinks.module.css';

const AuthorLinks = props => {
  let style = props.inverted ? classes.inverted : '';

  const authorArray = props.authors.map(author => {
    return (
      <Link className={style} to={`/authors/${author._id}`} key={author._id}>
        {author.name}
      </Link>
    );
  });

  const authorArrayFormated = authorArray.map((authorLink, index, array) => {
    if (index === array.length - 1) {
      return <Fragment key={index}>{authorLink}</Fragment>;
    } else if (index === array.length - 2) {
      return (
        <Fragment key={index}>
          {authorLink}
          <span className={style}>{' & '}</span>
        </Fragment>
      );
    } else {
      return (
        <Fragment key={index}>
          {authorLink}
          <span className={style}>{', '}</span>
        </Fragment>
      );
    }
  });

  return <Fragment>{authorArrayFormated}</Fragment>;
};

AuthorLinks.propTypes = {
  authors: PropTypes.array.isRequired,
  inverted: PropTypes.bool.isRequired
};

AuthorLinks.defaultProps = {
  inverted: false
};

export default AuthorLinks;
