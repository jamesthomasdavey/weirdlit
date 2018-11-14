const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = reqBody => {
  let errors = {};

  reqBody.title = !isEmpty(reqBody.title) ? reqBody.title : '';
  reqBody.subtitle = !isEmpty(reqBody.subtitle) ? reqBody.subtitle : '';
  reqBody.authors = !isEmpty(reqBody.authors) ? reqBody.authors : '';
  reqBody.pageCount = !isEmpty(reqBody.pageCount) ? reqBody.pageCount : '';
  reqBody.googleId = !isEmpty(reqBody.googleId) ? reqBody.googleId : '';
  reqBody.isbn10 = !isEmpty(reqBody.isbn10) ? reqBody.isbn10 : '';
  reqBody.isbn13 = !isEmpty(reqBody.isbn13) ? reqBody.isbn13 : '';
  reqBody.description = !isEmpty(reqBody.description) ? reqBody.description : '';
  reqBody.image = !isEmpty(reqBody.image) ? reqBody.image : '';

  if (Validator.isEmpty(reqBody.title)) {
    errors.title = 'Title is required';
  } else if (!Validator.isLength(reqBody.title, { max: 50 })) {
    errors.title = 'Title must be under 50 characters';
  }

  if (!Validator.isLength(reqBody.subtitle, { max: 75 })) {
    errors.subtitle = 'Subtitle must be under 75 characters';
  }

  if (Validator.isEmpty(reqBody.authors)) {
    errors.authors = 'Authors is required';
  }

  if (Validator.isEmpty(reqBody.pageCount.toString())) {
    errors.pageCount = 'Page count is required';
  }

  const publishedDate = new Date(reqBody.publishedDate);
  const today = new Date();

  if (!publishedDate) {
    errors.publishedDate = 'Date published is required';
  } else if (publishedDate > today) {
    errors.publishedDate = 'Date published may not be in the future';
  }

  if (!Validator.isEmpty(reqBody.isbn10) && reqBody.isbn10.length !== 10) {
    errors.isbn10 = 'ISBN 10 must be 10 characters';
  }
  if (!Validator.isEmpty(reqBody.isbn13) && reqBody.isbn13.length !== 13) {
    errors.isbn13 = 'ISBN 13 must be 13 characters';
  }

  if (Validator.isEmpty(reqBody.description)) {
    errors.description = 'Description is required';
  } else if (!Validator.isLength(reqBody.description, { min: 50 })) {
    errors.description = 'Description must be at least 50 characters long';
  } else if (!Validator.isLength(reqBody.description, { max: 3000 })) {
    errors.description = 'Description must not exceed 3000 characters';
  }

  return errors;
};
