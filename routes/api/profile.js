const express = require("express");
const router = express.Router();

// @route     /api/books/test
// @desc      test books route
// @access    public
router.get("/test", (req, res) => res.json({ msg: "books test working..." }));

module.exports = router;
