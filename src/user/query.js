export function createViewerQuery() {
  return function ({ resolver, sequelizeGraphQLObjectTypes: { User } }) {
    return {
      viewer: {
        type: User,
        resolve: function (obj, args, context, info) {
          if(!context.user) {
            return null;
          }

          args.id = context.user.get("id");

          return resolver(DB.User)(obj, args, context, info);
        }
      }
    };
  }
}