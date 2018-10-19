const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const imgur = require('imgur-node-api');

// require routes
const authors = require('./routes/api/authors');
const books = require('./routes/api/books');
const profile = require('./routes/api/profile');
const reviews = require('./routes/api/reviews');
const users = require('./routes/api/users');

// run express as app
const app = express();

// imgur setup
const imgurClientId = require('./config/keys').imgur.clientId;
imgur.setClientID(imgurClientId);

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// configure db
const db = require('./config/keys').mongoURI;

// connect mongoose using database key
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log(`I've connected to the database.`))
  .catch(err => console.log(err));

// passport middleware
app.use(passport.initialize());

// passport config
require('./config/passport')(passport);

// use routes
app.use('/api/authors', authors);
app.use('/api/books', books);
app.use('/api/profile', profile);
app.use('/api/books/:bookId/reviews', reviews);
app.use('/api/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`I'm glad you're here, James.
Find me on port ${port}.`)
);
