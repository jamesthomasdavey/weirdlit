const express = require("express");
const router = express.Router();

// @route     /api/profile/test
// @desc      test profile route
// @access    public
router.get("/test", (req, res) => res.json({ msg: "profile test working..." }));

module.exports = router;
