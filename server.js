const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hey man!"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`The magic happens on port ${port}.`));
