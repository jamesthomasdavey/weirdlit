const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = reqBody => {
  let errors = {};

  reqBody.name = !isEmpty(reqBody.name) ? reqBody.name : '';
  reqBody.email = !isEmpty(reqBody.email) ? reqBody.email : '';
  reqBody.newPassword = !isEmpty(reqBody.newPassword) ? reqBody.newPassword : '';
  reqBody.newPassword2 = !isEmpty(reqBody.newPassword2) ? reqBody.newPassword2 : '';
  reqBody.oldPassword = !isEmpty(reqBody.oldPassword) ? reqBody.oldPassword : '';

  // name
  if (!Validator.isEmpty(reqBody.name)) {
    if (!Validator.isLength(reqBody.name, { min: 2 })) {
      errors.name = 'Name must be at least 2 characters';
    } else if (!Validator.isLength(reqBody.name, { max: 40 })) {
      errors.name = 'Name may not exceed 40 characters';
    }
  }

  // email
  if (!Validator.isEmpty(reqBody.email)) {
    if (!Validator.isEmail(reqBody.email)) {
      errors.email = 'Invalid email address';
    }
  }

  // newPassword
  if (!Validator.isEmpty(reqBody.newPassword)) {
    if (!Validator.isLength(reqBody.newPassword, { min: 6 })) {
      errors.newPassword = 'Password must be at least 6 characters';
    } else if (!Validator.isLength(reqBody.newPassword, { max: 30 })) {
      errors.newPassword = 'Password may not exceed 30 characters';
    }
  }

  // newPassword2
  if (Validator.isEmpty(reqBody.newPassword2) && !Validator.isEmpty(reqBody.newPassword)) {
    errors.newPassword2 = 'Password confirmation is required';
  }

  if (!Validator.equals(reqBody.newPassword, reqBody.newPassword2)) {
    errors.newPassword2 = 'Passwords do not match';
  }

  // oldPassword
  if (Validator.isEmpty(reqBody.oldPassword)) {
    errors.oldPassword = 'Current password is required';
  }

  return errors;
};
