"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isOwner = isOwner;
exports.isAuthenticated = isAuthenticated;

var _role = require("./../role");

function isOwner(args, context, info, source) {
  if (!context.user || !(0, _role.hasRoles)(context.user, "admin") || context.user.get("id") !== source.get("user_id")) {
    throw new Error("You not allow to perform this action");
  }
}

function isAuthenticated(args, context, info) {
  if (!context.user) {
    throw new Error("You must be authenticate to perform this action");
  }
}