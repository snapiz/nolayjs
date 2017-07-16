import express from "express";
import cors from "cors";
import helmet from "helmet";
import compress from "compression";
import bodyParser from "body-parser";
import { merge } from "lodash";
import * as GraphQL from "graphql";
import Sequelize from "sequelize";
import {
  createSequelizeGraphqlSchema,
  graphqlExpress,
  graphiqlExpress,
  sequelizeGraphQLObjectTypes
} from "relay-sequelize";

import { createSequelize } from "./database";;

export default function (options) {
  options = merge({
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

  const app = express()
    .use(cors(options.cors))
    .use(helmet(options.helmet))
    .use(compress(options.compression))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .set('options', options);

  options.middlewares.forEach(function (middleware) {
    if (middleware.configure) {
      middleware.configure(app);
    }
  });

  app.set('sequelize', createSequelize(app));

  app.start = function () {
    return app.get('sequelize').sync(options.sequelize.sync).then(function () {
      const schema = createSequelizeGraphqlSchema(app.get('sequelize'), {
        queries: function (nodeInterface, resolver) {
          return options.middlewares.filter(function (m) {
            return m.getQueries !== undefined;
          }).reduce(function (queries, m) {
            return { ...queries, ...m.getQueries({
                nodeInterface,
                sequelizeGraphQLObjectTypes,
                resolver,
                GraphQL,
                Sequelize,
                app
              }) };
          }, {});
        },
        mutations: function (nodeInterface, attributeFields) {
          return options.middlewares.filter(function (m) {
            return m.getMutations !== undefined;
          }).reduce(function (queries, m) {
            return {
              ...queries, ...m.getMutations({
                nodeInterface,
                sequelizeGraphQLObjectTypes,
                attributeFields,
                GraphQL,
                Sequelize,
                app
              })
            };
          }, {});
        }
      });

      app.use(options.graphql.url, graphqlExpress(request => ({
        schema: schema,
        context: request
      })));

      if (options.graphql.browser) {
        app.use(options.graphql.browser, graphiqlExpress({
          endpointURL: options.graphql.url,
        }));
      }

      return new Promise(function (resolve) {
        app.listen(options.app.port, function () {
          resolve(options.app.port);
        });
      });
    });
  }

  return app;
};