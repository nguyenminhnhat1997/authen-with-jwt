const JwtStrategy = require("passport-jwt").Strategy; // Khởi tạo chiến lược AUTH bằng passport-jww
const ExtractJwt = require("passport-jwt").ExtractJwt; // 1 số fun đc hỗ trợ để lấy token

const mongoose = require("mongoose");
const User = mongoose.model("users"); // truy cập đến collection users
const keys = require("./keys");

const opts = {}; //chiến lược nhận vào 1 opts nơi mà ta cấu hình cách lấy và xử lý với token
//@jwtFormRequest: nhận vào req của client và trả về token như 1 string
//@fromAuthHeaderAsBearerToken(): 1 fun hỗ trợ lấy token từ URL
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.serectKey; //key bí mật do ta tự tạo
//@ sử dụng export arrow function , tiết kiệm khỏi cần phải tạo biến

//@jwt_payload: chứa 1 token đã đc giải mã
//@done: là 1 passport error, nhận những đối số sau done(error, user, info)
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
