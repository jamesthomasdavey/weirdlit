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
    errors.name = 'Name field is required';
  } else if (!Validator.isLength(reqBody.name, { min: 2, max: 40 })) {
    errors.name = 'Name must be between 2 and 40 characters';
  }

  // email
  if (Validator.isEmpty(reqBody.email)) {
    errors.email = 'Email field is required';
  } else if (!Validator.isEmail(reqBody.email)) {
    errors.email = 'Invalid email address';
  }

  // password
  if (Validator.isEmpty(reqBody.password)) {
    errors.password = 'Password field is required';
  } else if (!Validator.isLength(reqBody.password, { min: 6 })) {
    errors.password = 'Password must be at least 6 characters';
  } else if (!Validator.isLength(reqBody.password, { max: 30 })) {
    errors.password = 'Password must be 30 characters or less';
  }

  // password2
  if (Validator.isEmpty(reqBody.password2)) {
    errors.password2 = 'Password confirmation is required';
  } else if (!Validator.equals(reqBody.password, reqBody.password2)) {
    errors.password2 = 'Passwords do not match';
  }

  return errors;
};
