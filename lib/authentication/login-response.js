"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createLoginResponse = createLoginResponse;

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createLoginResponse(user, _ref) {
  var _ref$passport = _ref.passport,
      secret = _ref$passport.secret,
      fields = _ref$passport.fields,
      expiresIn = _ref$passport.expiresIn;

  var token = _jsonwebtoken2.default.sign({ id: user.get("id") }, secret, { expiresIn: expiresIn });

  fields = fields.reduce(function (data, field) {
    data[field] = user.get(field);
    return data;
  }, {});

  return _extends({}, fields, {
    token: token
  });
}