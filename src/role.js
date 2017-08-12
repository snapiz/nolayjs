import { isString, camelCase } from "lodash";

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

function isAdmin(_, context) {
  if (!hasRoles(context.user, "admin")) {
    throw new Error("You not allow to perform this action");
  }
}

export function configureRole({ policies }) {
  policies.isAdmin = isAdmin;
}

export function createRoleMutations() {
  return ({
    graphqlEdgeTypes,
    GraphQL: { GraphQLNonNull, GraphQLString, GraphQLList },
    sequelize: { models },
    argsToSequelize,
    resolveEdge
  }) => {
    const graphqlType = graphqlEdgeTypes.User;
    const model = models.User;

    return {
      addRoleToUser: {
        name: "addRoleToUser",
        inputFields: {
          id: { type: new GraphQLNonNull(GraphQLString) },
          roles: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) }
        },
        outputFields: {
          [camelCase(graphqlType.name)]: {
            type: graphqlType,
            resolve: function (source) {
              return resolveEdge(source);
            },
          }
        },
        mutateAndGetPayload: function (args, context, info) {
          isAdmin(args, context);
          args = argsToSequelize(model, args);
          return model.findById(args.id).then((row) => {
            if (!row) {
              throw new Error(`${model.name} not found`);
            }

            if (!row.roles) {
              row.roles = {};
            }
            args.roles.forEach(function (role) {
              row.roles[role] = true;
            });

            return row.update({ roles: row.roles });
          });
        },
      },
      removeRoleToUser: {
        name: "removeRoleToUser",
        inputFields: {
          id: { type: new GraphQLNonNull(GraphQLString) },
          roles: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) }
        },
        outputFields: {
          [camelCase(graphqlType.name)]: {
            type: graphqlType,
            resolve: function (source) {
              return resolveEdge(source);
            },
          }
        },
        mutateAndGetPayload: function (args, context, info) {
          isAdmin(args, context);
          args = argsToSequelize(model, args);
          return model.findById(args.id).then((row) => {
            if (!row) {
              throw new Error(`${model.name} not found`);
            }

            if (!row.roles) {
              row.roles = {};
            }
            args.roles.forEach(function (role) {
              delete row.roles[role];
            });

            return row.update({ roles: row.roles });
          });
        },
      }
    };
  }
}