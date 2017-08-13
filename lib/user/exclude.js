"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUserExcludeFields = createUserExcludeFields;

var _lodash = require("lodash");

var _utils = require("../utils");

function createUserExcludeFields(options) {
  var exclude = ["user_id"];
  return (0, _lodash.mergeWith)(options, {
    graphql: {
      create: { exclude: exclude },
      update: { exclude: exclude }
    }
  }, _utils.customizer);
}