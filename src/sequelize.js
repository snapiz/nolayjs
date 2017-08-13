import Sequelize from "sequelize";
import { camelCase, upperFirst, upperCase, isString, merge } from "lodash";

import { createModelHook } from "./hooks";
import { createAclModelHooks } from "./acl";
import { createUserHooks, createUserExcludeFields } from "./user";

export function createSequelize({ sequelize: { database, models }, hooks, acl, policies }) {
  const sequelize = new Sequelize(database);
  global.DB = {};

  const { sequelizeModels, oAssociations } = Object.keys(models).reduce(({ sequelizeModels, oAssociations }, name) => {
    const cname = camelCase(name);
    const uname = upperFirst(cname);

    const {
      fields,
      options,
      associations,
      instanceMethods,
      classMethods
    } = models[name];

    const sfields = fields ? Object.keys(fields).reduce(function (data, f) {
      const field = fields[f];
      data[f] = isString(field) ? Sequelize[upperCase(field)] : Object.assign({}, field, {
        type: Sequelize[upperCase(field.type)]
      });
      return data;
    }, {}) : {};

    const mhook = hooks[cname] || [];
    mhook.push.apply(mhook, createAclModelHooks(cname, acl, policies));

    if (cname !== "user") {
      mhook.push.apply(mhook, createUserHooks(cname, models[name]));
      models[name].options = createUserExcludeFields(models[name].options);
    }

    models[name].options = merge(models[name].options || {}, { graphql: createModelHook(mhook) });
    global.DB[uname] = sequelizeModels[name] = sequelize.define(uname, sfields, options);

    if(instanceMethods) {
      Object.keys(instanceMethods).forEach((m) => {
        global.DB[uname].prototype[m] = instanceMethods[m];
      });
    }

    if(classMethods) {
      Object.keys(classMethods).forEach((m) => {
        global.DB[uname][m] = classMethods[m];
      });
    }

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