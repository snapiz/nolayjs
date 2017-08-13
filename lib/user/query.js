"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createViewerQuery = createViewerQuery;
function createViewerQuery() {
  return function (_ref) {
    var resolver = _ref.resolver,
        User = _ref.sequelizeGraphQLObjectTypes.User;

    return {
      viewer: {
        type: User,
        resolve: function resolve(obj, args, context, info) {
          if (!context.user) {
            return null;
          }

          args.id = context.user.get("id");

          return resolver(DB.User)(obj, args, context, info);
        }
      }
    };
  };
}