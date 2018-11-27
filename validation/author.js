const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = reqBody => {
  let errors = {};

  reqBody.name = !isEmpty(reqBody.name) ? reqBody.name : '';
  reqBody.bio = !isEmpty(reqBody.bio) ? reqBody.bio : '';
  reqBody.website = !isEmpty(reqBody.website) ? reqBody.website : '';

  if (!Validator.isEmpty(reqBody.name) && !Validator.isLength(reqBody.name, { min: 2, max: 40 })) {
    errors.name = 'Name must be between 2 and 40 characters';
  }

  if (Validator.isEmpty(reqBody.name)) {
    errors.name = 'Name field is required';
  }

  if (!Validator.isEmpty(reqBody.bio) && !Validator.isLength(reqBody.bio, { max: 1000 })) {
    errors.bio = 'Bio must be 1000 characters or less';
  }

  if (!Validator.isEmpty(reqBody.website) && !Validator.isURL(reqBody.website)) {
    errors.website = 'Not a valid URL';
  }

  return errors;
};
