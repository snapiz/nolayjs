const sequelize_fixtures = require('sequelize-fixtures');

import app from "./data/app";

before(function (cb) {
  app.sync.then(function ({ sequelize, schema }) {
    global.GraphQLSchema = schema;
    return sequelize_fixtures.loadFile('./test/data/fixtures.yml', sequelize.models);
  })
    .then(function () {
      cb();
    });
})