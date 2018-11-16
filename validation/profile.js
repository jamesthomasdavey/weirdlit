const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = reqBody => {
  let errors = {};

  reqBody.handle = !isEmpty(reqBody.handle) ? reqBody.handle : '';
  reqBody.location = !isEmpty(reqBody.location) ? reqBody.location : '';
  reqBody.bio = !isEmpty(reqBody.bio) ? reqBody.bio : '';
  reqBody.goodreads = !isEmpty(reqBody.goodreads) ? reqBody.goodreads : '';
  reqBody.twitter = !isEmpty(reqBody.twitter) ? reqBody.twitter : '';
  reqBody.facebook = !isEmpty(reqBody.facebook) ? reqBody.facebook : '';
  reqBody.instagram = !isEmpty(reqBody.instagram) ? reqBody.instagram : '';

  if (
    !Validator.isEmpty(reqBody.handle) &&
    !Validator.isLength(reqBody.handle, { min: 2, max: 40 })
  ) {
    errors.handle = 'Handle must be between 2 and 40 characters';
  }

  if (
    reqBody.handle.toLowerCase().substring(0, 4) === 'edit' ||
    reqBody.handle.toLowerCase().substring(0, 4) === 'user'
  ) {
    errors.handle = 'Invalid handle';
  }

  if (
    !isEmpty(reqBody.favoriteBook) &&
    !Validator.isLength(reqBody.favoriteBook.title, { max: 200 })
  ) {
    errors.favoriteBook = 'Favorite Book must be 200 characters or less';
  }

  if (
    !Validator.isEmpty(reqBody.location) &&
    !Validator.isLength(reqBody.location, { min: 2, max: 100 })
  ) {
    errors.location = 'Location must be between 2 and 100 characters';
  }

  if (!Validator.isEmpty(reqBody.bio) && !Validator.isLength(reqBody.bio, { max: 1000 })) {
    errors.bio = 'Bio must be 1000 characters or less';
  }

  if (!Validator.isEmpty(reqBody.goodreads) && !Validator.isURL(reqBody.goodreads)) {
    errors.goodreads = 'Not a valid URL';
  }
  if (!Validator.isEmpty(reqBody.twitter) && !Validator.isURL(reqBody.twitter)) {
    errors.twitter = 'Not a valid URL';
  }
  if (!Validator.isEmpty(reqBody.facebook) && !Validator.isURL(reqBody.facebook)) {
    errors.facebook = 'Not a valid URL';
  }
  if (!Validator.isEmpty(reqBody.instagram) && !Validator.isURL(reqBody.instagram)) {
    errors.instagram = 'Not a valid URL';
  }

  return errors;
};
