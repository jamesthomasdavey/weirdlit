const express = require("express");
const mongoose = require("mongoose");

// require routes
const books = require("./routes/api/books");
const profile = require("./routes/api/profile");
const users = require("./routes/api/users");

// run express as app
const app = express();

// import database key
const db = require("./config/keys").mongoURI;

// connect mongoose using database key
mongoose
  .connect(db)
  .then(() => console.log("Successfully connected to database."))
  .catch(err => console.log(err));

// root route
app.get("/", (req, res) => res.send("Hey man!"));

// use routes
app.use("/api/books", books);
app.use("/api/profile", profile);
app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`The magic happens on port ${port}.`));
