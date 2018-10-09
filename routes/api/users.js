const express = require("express");
const router = express.Router();

// @route     /api/users/test
// @desc      test users route
// @access    public
router.get("/test", (req, res) => res.json({ msg: "users test working..." }));

module.exports = router;
