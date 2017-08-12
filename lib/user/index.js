"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureUser = configureUser;
exports.createViewerQuery = createViewerQuery;
exports.createUserAssociations = createUserAssociations;
exports.createUserHooks = createUserHooks;
exports.createUserExcludeFields = createUserExcludeFields;

var _lodash = require("lodash");

var _user = require("./models/user");

var _user2 = _interopRequireDefault(_user);

var _role = require("./../role");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configureUser(_ref) {
  var policies = _ref.policies,
      acl = _ref.acl,
      models = _ref.sequelize.models;

  policies.isOwner = isOwner;
  policies.isAuthenticated = isAuthenticated;

  _user2.default.options.graphql.before = policies.isAdmin;

  models.user = (0, _lodash.mergeWith)(_user2.default, models.user || {}, customizer);

  Object.keys(models).forEach(function (name) {
    var cname = (0, _lodash.camelCase)(name);

    if (cname === "user") {
      return;
    }

    models.user.associations.push({
      type: "hasMany",
      target: cname,
      options: { as: cname + "s", foreignKey: "user_id" }
    });

    if (!models[name].associations) {
      models[name].associations = [];
    }

    models[name].associations.push({
      type: "belongsTo",
      target: "user",
      options: { as: "createdBy", foreignKey: "user_id" }
    });
  });
}

function isOwner(args, context, info, source) {
  if (!context.user || !(0, _role.hasRoles)(context.user, "admin") || context.user.get("id") !== source.get("user_id")) {
    throw new Error("You not allow to perform this action");
  }
}

function isAuthenticated(args, context, info) {
  if (!context.user) {
    throw new Error("You must be authenticate to perform this action");
  }
}

function createViewerQuery() {
  return function (_ref2) {
    var resolver = _ref2.resolver,
        User = _ref2.sequelizeGraphQLObjectTypes.User;

    return {
      viewer: {
        type: User,
        resolve: function resolve(obj, args, context, info) {
          args.id = 1;
          return resolver(DB.User)(obj, args, context, info);
        }
      }
    };
  };
}

function createUserAssociations(_ref3) {
  var fields = _ref3.fields,
      options = _ref3.options,
      associations = _ref3.associations;

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

  return { fields: fields, options: options, associations: associations };
}

function createUserHooks(name) {
  return [{
    model: name, type: "find", before: function before(args, context, info) {
      isAuthenticated(args, context, info);
      if (!(0, _role.hasRoles)(context.user, "admin")) {
        args.user_id = context.user.get("id");
      }
    }
  }, {
    model: name, type: "create", before: function before(args, context, info) {
      isAuthenticated(args, context, info);

      args.user_id = context.user.get("id");
    }
  }, {
    model: name, type: "update", before: function before(args, context, info, source) {
      isOwner(args, context, info, source);
    }
  }, {
    model: name, type: "delete", before: function before(args, context, info, source) {
      isOwner(args, context, info, source);
    }
  }];
}

function createUserExcludeFields(options) {
  var exclude = ["user_id"];
  return (0, _lodash.mergeWith)(options, {
    graphql: {
      create: { exclude: exclude },
      update: { exclude: exclude }
    }
  }, customizer);
}

function customizer(objValue, srcValue) {
  if ((0, _lodash.isArray)(objValue)) {
    return objValue.concat(srcValue);
  }
}