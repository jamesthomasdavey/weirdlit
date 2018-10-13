const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./../models/User'); // we can do this, right?
const keys = require('./keys');

module.exports = passport => {
  passport.use(
    new JwtStrategy(
      { jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: keys.secretOrKey },
      (jwt_payload, done) => {
        User.findById(jwt_payload._id)
          .then(user => {
            if (user) {
              return done(null, user);
            }
            return done(null, false);
          })
          .catch(err => console.log(err));
      }
    )
  );
};
