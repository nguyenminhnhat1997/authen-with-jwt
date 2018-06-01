var express = require("express");
var mongoose = require("mongoose");
var gravatar = require("gravatar");
var bcrypt = require("bcryptjs");
var db = require("../../config/keys").mongoURI;
mongoose
  .connect(db)
  .then(() => console.log("Kết nối thành công với database"))
  .catch(err => console.log(err));
var User = require("../../models/User");
var router = express.Router();

//@route   GET /api/users
//@desc    test
//@access  Public
router.get("/", (req, res) => {
  res.json({ msg: "users" });
});

//@route   POST /api/users/register
//@desc    đăng kí user
//@access  Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      res.status(400).json({ msg: "Email đã tồn tại" });
    } else {
      var avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", // Rating
        d: "mm" //Default
      });
      var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.hash(newUser.password, 10, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      });
    }
  });
});

//@route   POST /api/users/login
//@desc    đăng nhập
//@access  Public
router.post("/login", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  User.findOne({ email }, (err, user) => {
    if (err) throw err;
    if (!user) {
      res.status(404).json({ msg: "Email không đúng" });
    } else {
      var hash = user.password;
      bcrypt.compare(password, hash, function(err, value) {
        if (err) throw err;
        console.log(value);
        res.json({ msg: "Thành công !" });
      });
    }
  });
});
module.exports = router;
