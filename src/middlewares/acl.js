import { merge, isArray, isString } from "lodash";

export function configure(app) {
  const { sequelize: { models }, acl, policies } = app.get("options");
  
  Object.keys(models).forEach(function (m) {
    const mAcl = acl[m];
    const model = models[m];

    if (!mAcl) {
      return;
    }

    model.graphql = merge(createACLFunctions(mAcl, policies), model.graphql || {});
  });
}

function createACLFunctions(modelAcl, policies) {
  return ["find", "create", "update", "delete"].reduce(function (data, current) {
    let cAcl = modelAcl[current] || modelAcl["*"];
    if (!cAcl) {
      return data;
    }

    if (!isArray(cAcl)) {
      cAcl = [cAcl];
    }

    data[current] = {
      before: createBeforeFuntion(cAcl, policies)
    }

    return data;
  }, {});
}

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