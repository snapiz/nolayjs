"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  fields: {
    username: {
      type: "string"
    },
    email: {
      type: "string",
      allowNull: false,
      validate: { isEmail: true }
    },
    password: {
      type: "string"
    },
    roles: "json"
  },
  options: {
    indexes: [{
      fields: ['email']
    }],
    graphql: {
      update: {
        exclude: ["roles"]
      }
    },
    hooks: {
      beforeCreate: function beforeCreate(user, options) {
        return user.hashPassword();
      },
      beforeUpdate: function beforeUpdate(user, options) {}
    }
  },
  instanceMethods: {
    hashPassword: function hashPassword() {
      var user = this;

      return new Promise(function (resolve, reject) {
        _bcryptjs2.default.genSalt(10, function (err, salt) {
          if (err) {
            return reject(err);
          }
          _bcryptjs2.default.hash(user.password, salt, function (error, encrypted) {
            if (err) {
              reject(err);
            } else {
              user.set("password", encrypted);
              resolve(user);
            }
          });
        });
      });
    },
    verifyPassword: function verifyPassword(password) {
      var user = this;

      return new Promise(function (resolve, reject) {
        _bcryptjs2.default.compare(password, user.password, function (err, res) {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    }
  },
  associations: []
};