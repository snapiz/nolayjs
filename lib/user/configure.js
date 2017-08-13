"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureUser = configureUser;

var _user = require("./models/user");

var _user2 = _interopRequireDefault(_user);

var _lodash = require("lodash");

var _utils = require("../utils");

var _policies = require("./policies");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureUser(_ref) {
  var policies = _ref.policies,
      acl = _ref.acl,
      models = _ref.sequelize.models;

  policies.isOwner = _policies.isOwner;
  policies.isAuthenticated = _policies.isAuthenticated;

  _user2.default.options.graphql.before = policies.isAdmin;

  models.user = (0, _lodash.mergeWith)(_user2.default, models.user || {}, _utils.customizer);

  Object.keys(models).forEach(function (name) {
    var cname = (0, _lodash.camelCase)(name);

    if (cname === "user") {
      return;
    }

    models.user.associations.push({
      type: "hasMany",
      target: cname,
      options: { as: cname + "s", foreignKey: "user_id" }
    });

    if (!models[name].associations) {
      models[name].associations = [];
    }

    models[name].associations.push({
      type: "belongsTo",
      target: "user",
      options: { as: "createdBy", foreignKey: "user_id" }
    });
  });
}