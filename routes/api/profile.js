var express = require("express");
var router = express.Router();

//@route   GET /api/profile
//@desc    test
//@access  Public
router.get("/", (req, res) => {
  res.json({ msg: "profile" });
});

module.exports = router;
