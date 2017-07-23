import Sequelize from "sequelize";
import { camelCase, upperFirst, upperCase, isString } from "lodash";

export function configure(app) {
  const { sequelize: { database, models, sync }, _middlewares } = app.get("options");
  const sequelize = new Sequelize(database);

  let modelNameMapped = {};

  Object.keys(models).forEach(function (name) {
    const {
      fields,
      options,
      graphql
    } = models[name];

    const _name = camelCase(name);
    const _options = graphql !== undefined ? { ...options, graphql } : options;
    const _fields = fields ? Object.keys(fields).reduce(function (data, f) {
      const field = fields[f];
      data[f] = isString(field) ? Sequelize[upperCase(field)] : Object.assign({}, field, {
        type: Sequelize[upperCase(field.type)]
      });
      return data;
    }, {}) : {};

    modelNameMapped[name] = sequelize.define(upperFirst(_name), _fields, _options);
  });

  app.set("models", modelNameMapped);

  Object.keys(models).forEach(function (name) {
    const { associations } = models[name];

    if (!associations) {
      return;
    }

    associations.forEach(function (association) {
      modelNameMapped[name][association.type](modelNameMapped[association.target], association.options);
    });
  });

  app.set('sequelize', sequelize);

  _middlewares.sync.push(sequelize.sync(sync));
}