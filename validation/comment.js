const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = reqBody => {
  const errors = {};

  reqBody.text = !isEmpty(reqBody.text) ? reqBody.text : '';

  if (Validator.isEmpty(reqBody.text)) {
    errors.newComment = 'This field is required';
  } else if (!Validator.isLength(reqBody.text, { min: 10 })) {
    errors.newComment = 'Comment must be at least 10 characters long';
  } else if (!Validator.isLength(reqBody.text, { max: 600 })) {
    errors.newComment = 'Comment must not exceed 600 characters';
  }

  return errors;
};
