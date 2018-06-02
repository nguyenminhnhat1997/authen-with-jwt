var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const passport = require("passport");

var users = require("./routes/api/users");
var profile = require("./routes/api/profile");
var posts = require("./routes/api/posts");
var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
// Tạo passport midlware khi muốn sử dụng passport để phân quyền phải tạo

// Passport config
//@ vì passport.js export 1 arrow function nên ta khai báo như này và sử dụng biến đại diện là passport

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// app.get("/", (req, res) => {
//   res.send({ msg: "Hello" });
// });
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
const port = process.env.PORT || 6000;
app.listen(port);
module.exports = app;
