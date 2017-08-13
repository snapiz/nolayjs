import { hasRoles } from "./../role";
import { isAuthenticated, isOwner } from "./policies";

export function createUserHooks(name, { options: { graphql } }) {
  return [{
    model: name, type: "find", before: (args, context, info) => {
      if (graphql && graphql.anonyme) {
        return;
      }

      isAuthenticated(args, context, info);

      if (!hasRoles(context.user, "admin")) {
        args.user_id = context.user.get("id");
      }
    }
  }, {
    model: name, type: "create", before: (args, context, info) => {
      isAuthenticated(args, context, info);

      args.user_id = context.user.get("id");
    }
  }, {
    model: name, type: "update", before: (args, context, info, source) => {
      isOwner(args, context, info, source);
    }
  }, {
    model: name, type: "delete", before: (args, context, info, source) => {
      isOwner(args, context, info, source);
    }
  }];
}