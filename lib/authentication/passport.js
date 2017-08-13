"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require("passport-local");

var _passportLocal2 = _interopRequireDefault(_passportLocal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_passport2.default.use(new _passportLocal2.default(function (username, password, done) {
  DB.User.findOne({ where: { username: username } }).then(function (user) {
    if (!user) {
      return false;
    }
    return user.verifyPassword(password).then(function (isValid) {
      return isValid ? user : false;
    });
  }).then(function (user) {
    done(null, user);
  }).catch(function (err) {
    done(err);
  });
}));

exports.default = _passport2.default;