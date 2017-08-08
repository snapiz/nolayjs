import Sequelize from "sequelize";
import { camelCase, upperFirst, upperCase, isString, merge } from "lodash";

import { createModelHook } from "./hooks";
import { createAclModelHooks } from "./acl";

export function createSequelize({ sequelize: { database, models }, hooks, acl, policies }) {
  const sequelize = new Sequelize(database);

  const { sequelizeModels, oAssociations } = Object.keys(models).reduce(({ sequelizeModels, oAssociations }, name) => {
    const {
      fields,
      options,
      associations
    } = models[name];

    const cname = camelCase(name);

    const sfields = fields ? Object.keys(fields).reduce(function (data, f) {
      const field = fields[f];
      data[f] = isString(field) ? Sequelize[upperCase(field)] : Object.assign({}, field, {
        type: Sequelize[upperCase(field.type)]
      });
      return data;
    }, {}) : {};

    const mhook = hooks[cname] || [];
    mhook.push.apply(mhook, createAclModelHooks(cname, acl, policies));
    models[name].options = merge(models[name].options || {}, { graphql: createModelHook(mhook) });
    sequelizeModels[name] = sequelize.define(upperFirst(cname), sfields, options);

    if (associations) {
      const callbacks = associations.map((association) => {
        return () => { sequelizeModels[name][association.type](sequelizeModels[association.target], association.options) };
      });

      oAssociations.push.apply(oAssociations, callbacks);
    }
    
    return { sequelizeModels, oAssociations };
  }, { sequelizeModels: {}, oAssociations: [] });

  oAssociations.forEach((cb) => { cb() });

  return sequelize;
}