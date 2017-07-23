import * as GraphQL from "graphql";
import Sequelize from "sequelize";
import {
  createSequelizeGraphqlSchema,
  graphqlExpress,
  graphiqlExpress,
  sequelizeGraphQLObjectTypes
} from "relay-sequelize";

export const defaultOptions = {
  _middlewares: {
    queries: [],
    mutations: []
  }
}

export function configure(app) {
  const { _middlewares: { queries, mutations, load }, graphql: { url, browser } } = app.get('options');
  load.push(function () {
    const schema = createSequelizeGraphqlSchema(app.get('sequelize'), {
      queries: createQueries(queries),
      mutations: createMutations(mutations)
    });

    app.set("schema", schema);

    app.use(url, graphqlExpress(request => ({
      schema: schema,
      context: request
    })));

    if (browser) {
      app.use(browser, graphiqlExpress({
        endpointURL: url,
      }));
    }
  });
}

function createQueries(queries) {
  return function (nodeInterface, resolver) {
    return queries.reduce(function (data, q) {
      return {
        ...data, ...q({
          nodeInterface,
          nodeInterface,
          sequelizeGraphQLObjectTypes,
          resolver,
          GraphQL,
          Sequelize
        })
      };
    }, {});
  };
}

function createMutations(mutations) {
  return function (nodeInterface, attributeFields) {
    return mutations.reduce(function (data, m) {
      return {
        ...data, ...m({
          nodeInterface,
          sequelizeGraphQLObjectTypes,
          attributeFields,
          GraphQL,
          Sequelize
        })
      };
    }, {});
  };
}