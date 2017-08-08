import { merge, isArray, isString } from "lodash";

function createBeforeFuntion(cAcl, policies) {
  return function (args, context, info) {
    cAcl.forEach(function (fn) {
      if (isString(fn)) {
        fn = policies[fn];
      }
      fn(args, context, info);
    });
  }
}

export function createAclModelHooks(name, acl, policies) {
  if (!acl) {
    return [];
  }
  const mAcl = acl[name];

  if (!mAcl) {
    return;
  }

  return ["find", "create", "update", "delete"].map(function (type) {
    let cAcl = mAcl[type] || mAcl["*"];
    if (!cAcl) {
      return;
    }

    if (!isArray(cAcl)) {
      cAcl = [cAcl];
    }

    return { model: name, type, before: createBeforeFuntion(cAcl, policies) };
  });
}