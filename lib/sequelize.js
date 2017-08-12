"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSequelize = createSequelize;

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

var _lodash = require("lodash");

var _hooks = require("./hooks");

var _acl = require("./acl");

var _user = require("./user");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createSequelize(_ref) {
  var _ref$sequelize = _ref.sequelize,
      database = _ref$sequelize.database,
      models = _ref$sequelize.models,
      hooks = _ref.hooks,
      acl = _ref.acl,
      policies = _ref.policies;

  var sequelize = new _sequelize2.default(database);
  global.DB = {};

  var _Object$keys$reduce = Object.keys(models).reduce(function (_ref2, name) {
    var sequelizeModels = _ref2.sequelizeModels,
        oAssociations = _ref2.oAssociations;

    var cname = (0, _lodash.camelCase)(name);
    var uname = (0, _lodash.upperFirst)(cname);

    var _models$name = models[name],
        fields = _models$name.fields,
        options = _models$name.options,
        associations = _models$name.associations;


    var sfields = fields ? Object.keys(fields).reduce(function (data, f) {
      var field = fields[f];
      data[f] = (0, _lodash.isString)(field) ? _sequelize2.default[(0, _lodash.upperCase)(field)] : Object.assign({}, field, {
        type: _sequelize2.default[(0, _lodash.upperCase)(field.type)]
      });
      return data;
    }, {}) : {};

    var mhook = hooks[cname] || [];
    mhook.push.apply(mhook, (0, _acl.createAclModelHooks)(cname, acl, policies));

    if (cname !== "user") {
      mhook.push.apply(mhook, (0, _user.createUserHooks)(cname));
      models[name].options = (0, _user.createUserExcludeFields)(models[name].options);
    }

    models[name].options = (0, _lodash.merge)(models[name].options || {}, { graphql: (0, _hooks.createModelHook)(mhook) });
    global.DB[uname] = sequelizeModels[name] = sequelize.define(uname, sfields, options);

    if (associations) {
      var callbacks = associations.map(function (association) {
        return function () {
          sequelizeModels[name][association.type](sequelizeModels[association.target], association.options);
        };
      });

      oAssociations.push.apply(oAssociations, callbacks);
    }

    return { sequelizeModels: sequelizeModels, oAssociations: oAssociations };
  }, { sequelizeModels: {}, oAssociations: [] }),
      sequelizeModels = _Object$keys$reduce.sequelizeModels,
      oAssociations = _Object$keys$reduce.oAssociations;

  oAssociations.forEach(function (cb) {
    cb();
  });

  return sequelize;
}