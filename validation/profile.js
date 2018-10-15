const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = reqBody => {
  let errors = {};

  reqBody.handle = !isEmpty(reqBody.handle) ? reqBody.handle : '';
  reqBody.favoriteBook = !isEmpty(reqBody.favoriteBook) ? reqBody.favoriteBook : '';
  reqBody.location = !isEmpty(reqBody.location) ? reqBody.location : '';
  reqBody.bio = !isEmpty(reqBody.bio) ? reqBody.bio : '';
  



  return errors;
};
