var express = require("express");
var router = express.Router();

//@route   GET /api/posts
//@desc    test
//@access  Public
router.get("/", (req, res) => {
  res.json({ msg: "posts" });
});

module.exports = router;
