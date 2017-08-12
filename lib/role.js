"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasRoles = hasRoles;
exports.configureRole = configureRole;
exports.createRoleMutations = createRoleMutations;

var _lodash = require("lodash");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function hasRoles(source, roles) {
  if (!source || !source.get("roles") || !roles) {
    roles = [];
  }

  if ((0, _lodash.isString)(roles)) {
    roles = [roles];
  }

  for (var i = 0; i < roles.length; i++) {
    if (source.get("roles")[roles[i]] !== undefined) {
      return true;
    }
  }

  return false;
}

function configureRole(_ref) {
  var policies = _ref.policies;

  policies.isAdmin = function (_, context) {
    if (!hasRoles(context.user, "admin")) {
      throw new Error("You not allow to perform this action");
    }
  };
}

function createRoleMutations() {
  return function (_ref2) {
    var sequelizeGraphQLObjectTypes = _ref2.sequelizeGraphQLObjectTypes,
        _ref2$GraphQL = _ref2.GraphQL,
        GraphQLNonNull = _ref2$GraphQL.GraphQLNonNull,
        GraphQLString = _ref2$GraphQL.GraphQLString,
        GraphQLList = _ref2$GraphQL.GraphQLList,
        models = _ref2.sequelize.models;

    var graphqlType = sequelizeGraphQLObjectTypes.User;
    var model = models.User;

    return {
      addRoleToUser: {
        name: "addRoleToUser",
        inputFields: {
          id: { type: new GraphQLNonNull(GraphQLString) },
          roles: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) }
        },
        outputFields: _defineProperty({}, (0, _lodash.camelCase)(graphqlType.name), {
          type: graphqlType,
          resolve: function resolve(source) {
            return resolveEdge(source);
          }
        }),
        mutateAndGetPayload: function mutateAndGetPayload(args, context, info) {
          args = argsToSequelize(model, args);
          return model.findById(args.id).then(function (row) {
            if (!row) {
              throw new Error(model.name + " not found");
            }

            return row.update(args);
          });
        }
      }
    };
  };
}