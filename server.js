const express = require('express');
const enforce = require('express-sslify');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const imgur = require('imgur-node-api');
const compression = require('compression');
const path = require('path');
const cors = require('cors');

// require routes
const authors = require('./routes/api/authors');
const books = require('./routes/api/books');
const profile = require('./routes/api/profile');
const reviews = require('./routes/api/reviews');
const search = require('./routes/api/search');
const tags = require('./routes/api/tags');
const users = require('./routes/api/users');

// run express as app
const app = express();
app.use(compression());
// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });
cors({ credentials: true, origin: true });
app.use(cors());

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
mongoose.set('useCreateIndex', true);

// passport middleware
app.use(passport.initialize());

// passport config
require('./config/passport')(passport);

// use routes
app.use('/api/authors', authors);
app.use('/api/books', books);
app.use('/api/profile', profile);
app.use('/api/books/:bookId/reviews', reviews);
app.use('/api/search', search);
app.use('/api/tags', tags);
app.use('/api/users', users);

// server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Hello, James.
Find me on port ${port}.`)
);
