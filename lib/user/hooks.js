"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUserHooks = createUserHooks;

var _role = require("./../role");

var _policies = require("./policies");

function createUserHooks(name, _ref) {
  var graphql = _ref.options.graphql;

  return [{
    model: name, type: "find", before: function before(args, context, info) {
      if (graphql && graphql.anonyme) {
        return;
      }

      (0, _policies.isAuthenticated)(args, context, info);

      if (!(0, _role.hasRoles)(context.user, "admin")) {
        args.user_id = context.user.get("id");
      }
    }
  }, {
    model: name, type: "create", before: function before(args, context, info) {
      (0, _policies.isAuthenticated)(args, context, info);

      args.user_id = context.user.get("id");
    }
  }, {
    model: name, type: "update", before: function before(args, context, info, source) {
      (0, _policies.isOwner)(args, context, info, source);
    }
  }, {
    model: name, type: "delete", before: function before(args, context, info, source) {
      (0, _policies.isOwner)(args, context, info, source);
    }
  }];
}