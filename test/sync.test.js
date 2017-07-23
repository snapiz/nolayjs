const sequelize_fixtures = require('sequelize-fixtures');

import app from "./data/app";

const { _middlewares: { load, sync } } = app.get('options');

before(function (cb) {
  Promise.all(sync)
    .then(function () {
      return sequelize_fixtures.loadFile('./test/data/fixtures.yml', app.get('models'));
    })
    .then(function () {
      load.forEach(function (fn) {
        fn();
      });
      cb();
    });
})