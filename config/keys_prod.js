module.exports = {
  mongoURI: process.env.MONGO_URI,
  googleBooksApiKey: process.env.GOOGLE_BOOKS_API_KEY,
  secretOrKey: process.env.SECRET_OR_KEY,
  imgur: {
    clientId: process.env.IMGUR_CLIENT_ID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET
  },
  email: process.env.EMAIL
};
