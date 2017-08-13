import userModel from "./models/user";
import { mergeWith, camelCase } from "lodash";
import { customizer } from "../utils";
import { isAuthenticated, isOwner } from "./policies";

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