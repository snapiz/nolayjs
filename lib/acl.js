"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAclModelHooks = createAclModelHooks;

var _lodash = require("lodash");

function createBeforeFuntion(cAcl, policies) {
  return function (args, context, info) {
    cAcl.forEach(function (fn) {
      if ((0, _lodash.isString)(fn)) {
        fn = policies[fn];
      }
      fn(args, context, info);
    });
  };
}

function createAclModelHooks(name, acl, policies) {
  if (!acl) {
    return [];
  }
  var mAcl = acl[name];

  if (!mAcl) {
    return;
  }

  return ["find", "create", "update", "delete"].map(function (type) {
    var cAcl = mAcl[type] || mAcl["*"];
    if (!cAcl) {
      return;
    }

    if (!(0, _lodash.isArray)(cAcl)) {
      cAcl = [cAcl];
    }

    return { model: name, type: type, before: createBeforeFuntion(cAcl, policies) };
  });
}