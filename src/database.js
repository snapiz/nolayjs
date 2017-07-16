import Sequelize from "sequelize";
import { camelCase, upperFirst, upperCase, isString } from "lodash";

export function createSequelize(app) {
  const { sequelize: { database }, models } = app.get("options");
  const sequelize = new Sequelize(database);

  let modelNameMapped = {};
  let oModelNameMapped = {};

  Object.keys(models).forEach(function (name) {
    const {
      fields,
      options,
      graphql
    } = models[name];

    const _name = camelCase(name);
    const _modelName = upperFirst(_name);
    const _options = graphql !== undefined ? { ...options, graphql } : options;
    const _fields = fields ? Object.keys(fields).reduce(function (data, f) {
      const field = fields[f];
      data[f] = isString(field) ? Sequelize[upperCase(field)] : Object.assign({}, field, {
        type: Sequelize[upperCase(field.type)]
      });
      return data;
    }, {}) : {};

    modelNameMapped[_modelName] = _name;
    oModelNameMapped[name] = _name;

    app.set(_name, sequelize.define(_modelName, _fields, _options));
  });

  Object.keys(models).forEach(function (name) {
    const { associations } = models[name];

    if (!associations) {
      return;
    }

    const model = app.get(oModelNameMapped[name]);
    associations.forEach(function (association) {
      model[association.type](app.get(modelNameMapped[association.model]), association.options);
    });
  });

  return sequelize;
}