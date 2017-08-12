const { expect } = require('chai');
const { graphql } = require('graphql');
const { unbase64, base64 } = require('relay-sequelize/lib/utils/base64');

import app from "../data/app";

describe('Role', function () {
  const user1 = {
    _dataValues: {
      id: 1
    },
    get: (k) => { return user1._dataValues[k] }
  };
  const user2 = {
    _dataValues: {
      id: 2,
      roles: { admin: true }
    },
    get: (k) => { return user2._dataValues[k] }
  };
  it('should add role to user', function () {
    const query = `
      mutation AddRoleToUser($input: addRoleToUserInput!) {
        addRoleToUser(input: $input) {
          userEdge {
            node {
              id
              email
              firstName
              lastName
              roles
            }
          }
        }
      }
    `;

    const context = { user: user2 };
    const variables = {
      input: {
        id: base64("User:4"),
        roles: ["read_todo"]
      }
    };

    return graphql(GraphQLSchema, query, {}, context, variables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.addRoleToUser).to.not.null;

      const { id, email, firstName, lastName, roles } = result.data.addRoleToUser.userEdge.node;
      expect(unbase64(id)).to.be.eq("User:4");
      expect(roles).to.not.undefined;
      expect(roles.read_todo).to.be.eq(true);
      expect(email).to.be.eq("acl1@gmail.com");
      expect(firstName).to.be.eq("firtname acl 1");
      expect(lastName).to.be.eq("lastname acl 1");
      expect(result.errors).to.undefined;

      return true;
    })
  })

  it('should raise "You not allow to perform this action" trying to add role', function () {
    const query = `
      mutation AddRoleToUser($input: addRoleToUserInput!) {
        addRoleToUser(input: $input) {
          userEdge {
            node {
              id
              roles
            }
          }
        }
      }
    `;

    const context = { user: user1 };
    const variables = {
      input: {
        id: base64("User:1"),
        roles: ["read_todo"]
      }
    };

    return graphql(GraphQLSchema, query, {}, context, variables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.addRoleToUser).to.be.null;
      expect(result.errors).to.not.undefined;
      expect(result.errors[0].message).to.equals('You not allow to perform this action');

      return true;
    })
  })

  it('should remove role to user', function () {
    const query = `
      mutation RemoveRoleToUser($input: removeRoleToUserInput!) {
        removeRoleToUser(input: $input) {
          userEdge {
            node {
              id
              roles
            }
          }
        }
      }
    `;

    const context = { user: user2 };
    const variables = {
      input: {
        id: base64("User:1"),
        roles: ["read_todo"]
      }
    };

    return graphql(GraphQLSchema, query, {}, context, variables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.removeRoleToUser).to.not.null;
      
      const { id, email, firstName, lastName, roles } = result.data.removeRoleToUser.userEdge.node;
      expect(unbase64(id)).to.be.eq("User:1");
      expect(roles).to.not.undefined;
      expect(roles.read_todo).to.undefined;
      expect(result.errors).to.undefined;

      return true;
    })
  })
  it('should raise "You not allow to perform this action" trying to remove role', function () {
    const query = `
      mutation RemoveRoleToUser($input: removeRoleToUserInput!) {
        removeRoleToUser(input: $input) {
          userEdge {
            node {
              id
              roles
            }
          }
        }
      }
    `;

    const context = { user: user1 };
    const variables = {
      input: {
        id: base64("User:1"),
        roles: ["read_todo"]
      }
    };

    return graphql(GraphQLSchema, query, {}, context, variables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.removeRoleToUser).to.be.null;
      expect(result.errors).to.not.undefined;
      expect(result.errors[0].message).to.equals('You not allow to perform this action');

      return true;
    })
  })
})