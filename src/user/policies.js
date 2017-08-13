import { hasRoles } from "./../role";

export function isOwner(args, context, info, source) {
  if (!context.user || !hasRoles(context.user, "admin") || context.user.get("id") !== source.get("user_id")) {
    throw new Error("You not allow to perform this action");
  }
}

export function isAuthenticated(args, context, info) {
  if (!context.user) {
    throw new Error("You must be authenticate to perform this action");
  }
}