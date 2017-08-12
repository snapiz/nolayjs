"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.configureGraphQLServer = configureGraphQLServer;

var _graphql = require("graphql");

var GraphQL = _interopRequireWildcard(_graphql);

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

var _relaySequelize = require("relay-sequelize");

var _user = require("./user");

var _role = require("./role");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createQueries(sequelize, queries) {
  return function (nodeInterface, resolver) {
    return queries.reduce(function (data, q) {
      var _q;

      return _extends({}, data, q((_q = {
        nodeInterface: nodeInterface
      }, _defineProperty(_q, "nodeInterface", nodeInterface), _defineProperty(_q, "sequelizeGraphQLObjectTypes", _relaySequelize.sequelizeGraphQLObjectTypes), _defineProperty(_q, "resolver", resolver), _defineProperty(_q, "GraphQL", GraphQL), _defineProperty(_q, "sequelize", sequelize), _defineProperty(_q, "argsToSequelize", _relaySequelize.argsToSequelize), _defineProperty(_q, "resolveEdge", _relaySequelize.resolveEdge), _q)));
    }, {});
  };
}

function createMutations(sequelize, mutations) {
  return function (nodeInterface, attributeFields) {
    return mutations.reduce(function (data, m) {
      return _extends({}, data, m({
        nodeInterface: nodeInterface,
        sequelizeGraphQLObjectTypes: _relaySequelize.sequelizeGraphQLObjectTypes,
        attributeFields: attributeFields,
        GraphQL: GraphQL,
        sequelize: sequelize,
        argsToSequelize: _relaySequelize.argsToSequelize,
        resolveEdge: _relaySequelize.resolveEdge
      }));
    }, {});
  };
}

function configureGraphQLServer(app, sequelize, _ref) {
  var _ref$graphql = _ref.graphql,
      url = _ref$graphql.url,
      browser = _ref$graphql.browser,
      queries = _ref.queries,
      mutations = _ref.mutations;

  queries.push((0, _user.createViewerQuery)());
  mutations.push((0, _role.createRoleMutations)());

  var schema = (0, _relaySequelize.createSequelizeGraphqlSchema)(sequelize, {
    queries: createQueries(sequelize, queries),
    mutations: createMutations(sequelize, mutations)
  });

  app.use(url, (0, _relaySequelize.graphqlExpress)(function (request) {
    return {
      schema: schema,
      context: request
    };
  }));

  if (browser) {
    app.use(browser, (0, _relaySequelize.graphiqlExpress)({
      endpointURL: url
    }));
  }

  return schema;
}