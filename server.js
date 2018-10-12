const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

// require routes
const authors = require('./routes/api/authors');
const books = require('./routes/api/books');
const profile = require('./routes/api/profile');
const users = require('./routes/api/users');

// run express as app
const app = express();

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// configure db
const db = require('./config/keys').mongoURI;

// connect mongoose using database key
mongoose
  .connect(db)
  .then(() => console.log('Successfully connected to database.'))
  .catch(err => console.log(err));

// passport middleware
app.use(passport.initialize());

// use routes
app.use('/api/books', books);
app.use('/api/profile', profile);
app.use('/api/users', users);
app.use('/api/authors', authors);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`The magic happens on port ${port}.`));
