'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getQueries = getQueries;
exports.getMutations = getMutations;
exports.configure = configure;
function getQueries(_ref) {
  var app = _ref.app,
      resolver = _ref.resolver,
      User = _ref.sequelizeGraphQLObjectTypes.User;

  return {
    viewer: {
      type: User,
      resolve: function resolve(obj, args, context, info) {
        args.id = 1;
        return resolver(app.get('user'))(obj, args, context, info);
      }
    }
  };
}

function getMutations(_ref2) {
  var app = _ref2.app,
      resolver = _ref2.resolver,
      User = _ref2.sequelizeGraphQLObjectTypes.User,
      _ref2$GraphQL = _ref2.GraphQL,
      GraphQLNonNull = _ref2$GraphQL.GraphQLNonNull,
      GraphQLString = _ref2$GraphQL.GraphQLString;

  return {
    login: {
      name: 'login',
      inputFields: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      outputFields: {
        user: {
          type: User,
          resolve: function resolve(_ref3) {
            var dataValues = _ref3.dataValues;

            console.log(dataValues);
            return dataValues;
          }
        }
      },
      mutateAndGetPayload: function mutateAndGetPayload(args, context, info) {
        return app.get('user').create(args);
      }
    }
  };
}

function configure(app) {}