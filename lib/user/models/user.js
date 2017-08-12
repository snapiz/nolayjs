"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  fields: {
    username: {
      type: "string"
    },
    roles: "json"
  },
  options: {
    graphql: {
      update: {
        exclude: ["roles"]
      }
    }
  },
  associations: []
};