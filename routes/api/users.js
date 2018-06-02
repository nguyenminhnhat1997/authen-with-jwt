var express = require("express");
var mongoose = require("mongoose");
var gravatar = require("gravatar");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
var db = require("../../config/keys").mongoURI;
const keySerect = require("../../config/keys").serectKey;
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
      bcrypt.compare(password, hash, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          //Tạo JWT
          //Tạo JWt Playload
          var playload = { id: user.id, name: user.name, avatar: user.avatar };
          // use JWT
          jwt.sign(playload, keySerect, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({
              success: true,
              token: "Bearer " + token
            });
          });
        } else {
          res.json({ msg: "Password không đúng" });
        }
      });
    }
  });
});

//@route   GET /api/users/current
//@desc    in ra thông tin của user khi đăng nhập
//@access  Private
//@ api này có phân quyền passport.authenticate('jwt', {session: false})
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);
module.exports = router;
