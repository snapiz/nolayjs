import { mergeWith, isArray, camelCase } from "lodash";
import userModel from "./models/user";

export function configureUser({ sequelize: { models } }) {
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
    model: name, type: "create", before: (args, context, info) => {
      if (!context.user) {
        throw new Error(`You must be login to create ${name}`);
      }

      args.user_id = context.user.get("id");
    }
  },{
    model: name, type: "update", before: (args, context, info) => {
      if (!context.user) {
        throw new Error(`You must be login to create ${name}`);
      }

      args.user_id = context.user.get("id");
    }
  },{
    model: name, type: "delete", before: (args, context, info) => {
      if (!context.user) {
        throw new Error(`You must be login to create ${name}`);
      }

      args.user_id = context.user.get("id");
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