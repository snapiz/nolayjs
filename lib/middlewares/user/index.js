"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = configure;
function configure(app) {}

/* export function getQueries({ app, resolver, sequelizeGraphQLObjectTypes: { User } }) {
  return {
    viewer: {
      type: User,
      resolve: function (obj, args, context, info) {
        args.id = 1;
        return resolver(app.get('user'))(obj, args, context, info);
      }
    }
  };
}

export function getMutations({
  app,
  resolver,
  sequelizeGraphQLObjectTypes: {
     User
  },
  GraphQL: {
    GraphQLNonNull,
    GraphQLString
  }}) {
  return {
    login: {
      name: `login`,
      inputFields: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      outputFields: {
        user: {
          type: User,
          resolve: function ({ dataValues }) {
            console.log(dataValues)
            return dataValues;
          },
        }
      },
      mutateAndGetPayload: function (args, context, info) {
        return app.get('user').create(args);
      },
    }
  };
} */