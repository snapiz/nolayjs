"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {
  options = (0, _lodash.merge)({
    app: {
      port: 1337
    },
    passport: {
      secret: "Your secret key",
      fields: ["roles"],
      expiresIn: "7d"
    },
    graphql: {
      url: "/graphql",
      browser: false
    },
    sequelize: {
      database: {
        logging: false,
        dialect: "sqlite",
        storage: "./db.sqlite"
      },
      sync: {
        force: false
      }
    },
    queries: [],
    mutations: [],
    hooks: [],
    policies: {}
  }, options || {});

  var app = (0, _express2.default)().use((0, _cors2.default)(options.cors)).use((0, _helmet2.default)(options.helmet)).use((0, _compression2.default)(options.compression)).use(_bodyParser2.default.json()).use(_bodyParser2.default.urlencoded({ extended: true })).use((0, _authentication.bearToken)(options.bearToken)).use((0, _expressJwt2.default)({
    secret: options.passport.secret,
    credentialsRequired: false,
    getToken: function getToken(req) {
      return req.token;
    }
  })).use(_authentication.passport.initialize());

  app.post('/auth/local', _authentication.passport.authenticate('local', { session: false }), function (req, res) {
    res.json((0, _authentication.createLoginResponse)(req.user, options));
  });

  (0, _role.configureRole)(options);
  (0, _user.configureUser)(options);

  var sequelize = (0, _sequelize.createSequelize)(options);

  app.sync = sequelize.sync(options.sequelize.sync).then(function () {
    return { sequelize: sequelize, schema: (0, _graphql.configureGraphQLServer)(app, sequelize, options) };
  });

  app.run = function () {
    return app.sync.then(function () {
      return new Promise(function (resolve) {
        app.listen(options.app.port, function () {
          resolve(options.app.port);
        });
      });
    });
  };

  return app;
};

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _helmet = require("helmet");

var _helmet2 = _interopRequireDefault(_helmet);

var _compression = require("compression");

var _compression2 = _interopRequireDefault(_compression);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _lodash = require("lodash");

var _expressJwt = require("express-jwt");

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _sequelize = require("./sequelize");

var _graphql = require("./graphql");

var _user = require("./user");

var _role = require("./role");

var _authentication = require("./authentication");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;