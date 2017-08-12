import * as GraphQL from "graphql";
import Sequelize from "sequelize";
import {
  createSequelizeGraphqlSchema,
  graphqlExpress,
  graphiqlExpress,
  sequelizeGraphQLObjectTypes,
  graphqlEdgeTypes
} from "relay-sequelize";
import { 
  argsToSequelize,
  resolveEdge
 } from "relay-sequelize";

import { createViewerQuery } from "./user";
import { createRoleMutations } from "./role";

function createQueries(sequelize, queries) {
  return function (nodeInterface, resolver) {
    return queries.reduce(function (data, q) {
      return {
        ...data, ...q({
          nodeInterface,
          nodeInterface,
          sequelizeGraphQLObjectTypes,
          resolver,
          GraphQL,
          sequelize,
          argsToSequelize,
          resolveEdge,
          graphqlEdgeTypes
        })
      };
    }, {});
  };
}

function createMutations(sequelize, mutations) {
  return function (nodeInterface, attributeFields) {
    return mutations.reduce(function (data, m) {
      return {
        ...data, ...m({
          nodeInterface,
          sequelizeGraphQLObjectTypes,
          attributeFields,
          GraphQL,
          sequelize,
          argsToSequelize,
          resolveEdge,
          graphqlEdgeTypes
        })
      };
    }, {});
  };
}

export function configureGraphQLServer(app, sequelize, { graphql: { url, browser }, queries, mutations }) {
  queries.push(createViewerQuery());
  mutations.push(createRoleMutations());
  
  const schema = createSequelizeGraphqlSchema(sequelize, {
    queries: createQueries(sequelize, queries),
    mutations: createMutations(sequelize, mutations)
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