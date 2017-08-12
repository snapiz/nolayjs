import { isString } from "lodash";

export function hasRoles(source, roles) {
  if (!source || !source.get("roles") || !roles) {
    roles = [];
  }

  if (isString(roles)) {
    roles = [roles];
  }

  for (var i = 0; i < roles.length; i++) {
    if (source.get("roles")[roles[i]] !== undefined) {
      return true;
    }
  }

  return false;
}

function createRolePolicies(policies) {
  policies.isAdmin = (_, context) => {
    if (!hasRoles(context.user, "admin")) {
      throw new Error("You not allow to perform this action");
    }
  }
}

export function configureRole({ policies }) {
  createRolePolicies(policies);
}