const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./../models/User'); // we can do this, right?
const keys = require('./keys');

// This is where we get the token from the header, extract the payload from it, find the user with the corresponding id, and put the user into the request

module.exports = passport => {
  passport.use(
    new JwtStrategy(
      { jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: keys.secretOrKey },
      (jwt_payload, done) => {
        User.findById(jwt_payload._id)
          .then(user => {
            if (!user) return done(null, false);
            return done(null, user);
          })
          .catch(err => console.log(err));
      }
    )
  );
};
