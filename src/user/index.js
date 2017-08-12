import { mergeWith, isArray, camelCase } from "lodash";
import userModel from "./models/user";
import { hasRoles } from "./../role";

export function configureUser({ policies, acl, sequelize: { models } }) {
  policies.isOwner = isOwner;
  policies.isAuthenticated = isAuthenticated;

  userModel.options.graphql.before = policies.isAdmin;

  models.user = mergeWith(userModel, models.user || {}, customizer);

  Object.keys(models).forEach((name) => {
    const cname = camelCase(name);

    if (cname === "user") {
      return;
    }

    models.user.associations.push({
      type: "hasMany",
      target: cname,
      options: { as: `${cname}s`, foreignKey: "user_id" }
    });

    if (!models[name].associations) {
      models[name].associations = [];
    }

    models[name].associations.push({
      type: "belongsTo",
      target: "user",
      options: { as: "createdBy", foreignKey: "user_id" }
    })
  });
}

function isOwner(args, context, info, source) {
  if (!context.user || !hasRoles(context.user, "admin") || context.user.get("id") !== source.get("user_id")) {
    throw new Error("You not allow to perform this action");
  }
}

function isAuthenticated(args, context, info) {
  if (!context.user) {
    throw new Error("You must be authenticate to perform this action");
  }
}

export function createViewerQuery() {
  return function ({ resolver, sequelizeGraphQLObjectTypes: { User } }) {
    return {
      viewer: {
        type: User,
        resolve: function (obj, args, context, info) {
          args.id = 1;
          return resolver(DB.User)(obj, args, context, info);
        }
      }
    };
  }
}

export function createUserAssociations({ fields, options, associations }) {
  if (!fields) {
    fields = {};
  }
  if (!options) {
    options = {};
  }
  if (!associations) {
    associations = [];
  }

  associations.push();

  return { fields, options, associations };
}

export function createUserHooks(name) {
  return [{
    model: name, type: "find", before: (args, context, info) => {
      isAuthenticated(args, context, info);
      if(!hasRoles(context.user, "admin")) {
        args.user_id = context.user.get("id");
      }
    }
  }, {
    model: name, type: "create", before: (args, context, info) => {
      isAuthenticated(args, context, info);

      args.user_id = context.user.get("id");
    }
  }, {
    model: name, type: "update", before: (args, context, info, source) => {
      isOwner(args, context, info, source);
    }
  }, {
    model: name, type: "delete", before: (args, context, info, source) => {
      isOwner(args, context, info, source);
    }
  }];
}

export function createUserExcludeFields(options) {
  const exclude = ["user_id"];
  return mergeWith(options, {
    graphql: {
      create: { exclude },
      update: { exclude }
    }
  }, customizer);
}

function customizer(objValue, srcValue) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}