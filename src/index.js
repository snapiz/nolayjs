import express from "express";
import cors from "cors";
import helmet from "helmet";
import compress from "compression";
import bodyParser from "body-parser";
import { merge } from "lodash";

import { createSequelize } from "./sequelize";
import { configureGraphQLServer } from "./graphql";
import { configureUser } from "./user";

export default function (options) {
  options = merge({
    graphql: {
      url: "/graphql",
      browser: false
    },
    sequelize: {
      database: {
        logging: false,
        dialect: "sqlite",
        storage: "./db.sqlite"
      },
      sync: {
        force: false
      }
    },
    queries: [],
    mutations: [],
    hooks: []
  }, options || {});

  const app = express()
    .use(cors(options.cors))
    .use(helmet(options.helmet))
    .use(compress(options.compression))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }));

  configureUser(options);

  const sequelize = createSequelize(options);

  app.sync = sequelize.sync(options.sequelize.sync).then(() => {
    return { sequelize, schema: configureGraphQLServer(app, sequelize, options) };
  });

  app.listen = function () {
    return app.sync.then(() => {
      return new Promise(function (resolve) {
        app.listen(options.app.port, function () {
          resolve(options.app.port);
        });
      });
    })
  }

  return app;
};