import * as GraphQL from "graphql";
import Sequelize from "sequelize";
import {
  createSequelizeGraphqlSchema,
  graphqlExpress,
  graphiqlExpress,
  sequelizeGraphQLObjectTypes
} from "relay-sequelize";

import { createViewerQuery } from "./user";

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

export function configureGraphQLServer(app, sequelize, { graphql: { url, browser }, queries, mutations }) {
  queries.push(createViewerQuery(sequelize.models.User));
  const schema = createSequelizeGraphqlSchema(sequelize, {
    queries: createQueries(queries),
    mutations: createMutations(mutations)
  });

  app.use(url, graphqlExpress(request => ({
    schema: schema,
    context: request
  })));

  if (browser) {
    app.use(browser, graphiqlExpress({
      endpointURL: url,
    }));
  }

  return schema;
}