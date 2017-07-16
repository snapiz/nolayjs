"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (options) {
  options = (0, _lodash.merge)({
    middlewares: [],
    graphql: {
      url: "/graphql",
      browser: false
    },
    sequelize: {
      database: {
        logging: false
      },
      sync: {
        force: false
      }
    }
  }, options || {});

  var app = (0, _express2.default)().use((0, _cors2.default)(options.cors)).use((0, _helmet2.default)(options.helmet)).use((0, _compression2.default)(options.compression)).use(_bodyParser2.default.json()).use(_bodyParser2.default.urlencoded({ extended: true })).set('options', options);

  options.middlewares.forEach(function (middleware) {
    if (middleware.configure) {
      middleware.configure(app);
    }
  });

  app.set('sequelize', (0, _database.createSequelize)(app));

  app.start = function () {
    return app.get('sequelize').sync(options.sequelize.sync).then(function () {
      var schema = (0, _relaySequelize.createSequelizeGraphqlSchema)(app.get('sequelize'), {
        queries: function queries(nodeInterface, resolver) {
          return options.middlewares.filter(function (m) {
            return m.getQueries !== undefined;
          }).reduce(function (queries, m) {
            return _extends({}, queries, m.getQueries({
              nodeInterface: nodeInterface,
              sequelizeGraphQLObjectTypes: _relaySequelize.sequelizeGraphQLObjectTypes,
              resolver: resolver,
              GraphQL: GraphQL,
              Sequelize: _sequelize2.default,
              app: app
            }));
          }, {});
        },
        mutations: function mutations(nodeInterface, attributeFields) {
          return options.middlewares.filter(function (m) {
            return m.getMutations !== undefined;
          }).reduce(function (queries, m) {
            return _extends({}, queries, m.getMutations({
              nodeInterface: nodeInterface,
              sequelizeGraphQLObjectTypes: _relaySequelize.sequelizeGraphQLObjectTypes,
              attributeFields: attributeFields,
              GraphQL: GraphQL,
              Sequelize: _sequelize2.default,
              app: app
            }));
          }, {});
        }
      });

      app.use(options.graphql.url, (0, _relaySequelize.graphqlExpress)(function (request) {
        return {
          schema: schema,
          context: request
        };
      }));

      if (options.graphql.browser) {
        app.use(options.graphql.browser, (0, _relaySequelize.graphiqlExpress)({
          endpointURL: options.graphql.url
        }));
      }

      return new Promise(function (resolve) {
        app.listen(options.app.port, function () {
          resolve(options.app.port);
        });
      });
    });
  };

  return app;
};

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _helmet = require("helmet");

var _helmet2 = _interopRequireDefault(_helmet);

var _compression = require("compression");

var _compression2 = _interopRequireDefault(_compression);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _lodash = require("lodash");

var _graphql = require("graphql");

var GraphQL = _interopRequireWildcard(_graphql);

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

var _relaySequelize = require("relay-sequelize");

var _database = require("./database");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

;