const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = reqBody => {
  let errors = {};

  reqBody.name = !isEmpty(reqBody.name) ? reqBody.name : '';
  reqBody.email = !isEmpty(reqBody.email) ? reqBody.email : '';
  reqBody.password = !isEmpty(reqBody.password) ? reqBody.password : '';
  reqBody.password2 = !isEmpty(reqBody.password2) ? reqBody.password2 : '';

  // name
  if (Validator.isEmpty(reqBody.name)) {
    errors.name = 'Name is required';
  } else if (!Validator.isLength(reqBody.name, { min: 2 })) {
    errors.name = 'Name must be at least 2 characters';
  } else if (!Validator.isLength(reqBody.name, { max: 40 })) {
    errors.name = 'Name may not exceed 40 characters';
  }

  // email
  if (Validator.isEmpty(reqBody.email)) {
    errors.email = 'Email is required';
  } else if (!Validator.isEmail(reqBody.email)) {
    errors.email = 'Invalid email address';
  }

  // password
  if (Validator.isEmpty(reqBody.password)) {
    errors.password = 'Password field is required';
  } else if (!Validator.isLength(reqBody.password, { min: 6 })) {
    errors.password = 'Password must be at least 6 characters';
  } else if (!Validator.isLength(reqBody.password, { max: 30 })) {
    errors.password = 'Password may not exceed 30 characters';
  }

  // password2
  if (Validator.isEmpty(reqBody.password2)) {
    errors.password2 = 'Password confirmation is required';
  } else if (!Validator.equals(reqBody.password, reqBody.password2)) {
    errors.password2 = 'Passwords do not match';
  }

  // favoriteBook
  if (
    !isEmpty(reqBody.favoriteBook) &&
    !Validator.isLength(reqBody.favoriteBook.title, { max: 200 })
  ) {
    errors.favoriteBook = 'Favorite Book must be 200 characters or less';
  }

  return errors;
};
