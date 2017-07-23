"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.configure = configure;

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configure(app) {
  var _app$get = app.get("options"),
      database = _app$get.sequelize.database,
      models = _app$get.models;

  var sequelize = new _sequelize2.default(database);

  var modelNameMapped = {};
  var oModelNameMapped = {};

  Object.keys(models).forEach(function (name) {
    var _models$name = models[name],
        fields = _models$name.fields,
        options = _models$name.options,
        graphql = _models$name.graphql;


    var _name = (0, _lodash.camelCase)(name);
    var _modelName = (0, _lodash.upperFirst)(_name);
    var _options = graphql !== undefined ? _extends({}, options, { graphql: graphql }) : options;
    var _fields = fields ? Object.keys(fields).reduce(function (data, f) {
      var field = fields[f];
      data[f] = (0, _lodash.isString)(field) ? _sequelize2.default[(0, _lodash.upperCase)(field)] : Object.assign({}, field, {
        type: _sequelize2.default[(0, _lodash.upperCase)(field.type)]
      });
      return data;
    }, {}) : {};

    modelNameMapped[_modelName] = _name;
    oModelNameMapped[name] = _name;

    app.set(_name, sequelize.define(_modelName, _fields, _options));
  });

  Object.keys(models).forEach(function (name) {
    var associations = models[name].associations;


    if (!associations) {
      return;
    }

    var model = app.get(oModelNameMapped[name]);
    associations.forEach(function (association) {
      model[association.type](app.get(modelNameMapped[association.model]), association.options);
    });
  });

  app.set('sequelize', sequelize);
}