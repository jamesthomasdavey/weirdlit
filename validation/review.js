const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = reqBody => {
  const errors = {};

  reqBody.headline = !isEmpty(reqBody.headline) ? reqBody.headline : '';
  reqBody.text = !isEmpty(reqBody.text) ? reqBody.text : '';

  if (!reqBody.rating) {
    errors.rating = 'Rating is required';
  } else if (parseInt(reqBody.rating) < 1 || parseInt(reqBody.rating) > 5) {
    errors.rating = 'Rating must be between 1 and 5 stars';
  }

  if (Validator.isEmpty(reqBody.headline)) {
    errors.headline = 'Headline is required';
  } else if (!Validator.isLength(reqBody.headline, { min: 2 })) {
    errors.headline = 'Headline must be at least 2 characters long';
  } else if (!Validator.isLength(reqBody.headline, { max: 100 })) {
    errors.headline = 'Headline must not exceed 100 characters';
  }

  if (Validator.isEmpty(reqBody.text)) {
    errors.text = 'This field is required';
  } else if (!Validator.isLength(reqBody.text, { min: 50 })) {
    errors.text = 'Review must be at least 50 characters long';
  } else if (!Validator.isLength(reqBody.text, { max: 3000 })) {
    errors.text = 'Review must not exceed 3000 characters';
  }

  return errors;
};
