import express from "express";
import cors from "cors";
import helmet from "helmet";
import compress from "compression";
import bodyParser from "body-parser";
import { merge } from "lodash";

export default function (options) {
  options = merge({
    middlewares: [],
    _middlewares: {
      sync: [],
      load: []
    },
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
    }
  }, options || {});

  const app = express()
    .use(cors(options.cors))
    .use(helmet(options.helmet))
    .use(compress(options.compression))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .set('options', options);

  options.middlewares = [
    require("./middlewares/acl"),
    require("./middlewares/user"),
    ...options.middlewares,
    require("./middlewares/sequelize"),
    require("./middlewares/graphql")
  ];

  options.middlewares.forEach(function (middleware) {
    if(middleware.defaultOptions) {
      options = merge(options, middleware.defaultOptions);
    }
  });

  options.middlewares.forEach(function (middleware) {
    middleware.configure(app);
  });

  app.start = function () {
    return Promise.all(options._middlewares.sync).then(function () {
      options._middlewares.load.forEach(function (fn) {
        fn();
      });

      return new Promise(function (resolve) {
        app.listen(options.app.port, function () {
          resolve(options.app.port);
        });
      });
    });
  }

  return app;
};