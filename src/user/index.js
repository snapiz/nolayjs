import { mergeWith, isArray } from "lodash";
import userModel from "./models/user";

export function configureUser({ sequelize: { models } }) {
  models.user = mergeWith(userModel, models.user || {}, customizer);
}

export function createViewerQuery(model) {
  return function ({ resolver, sequelizeGraphQLObjectTypes: { User } }) {
    return {
      viewer: {
        type: User,
        resolve: function (obj, args, context, info) {
          args.id = 1;
          return resolver(model)(obj, args, context, info);
        }
      }
    };
  }
}

function customizer(objValue, srcValue) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}