const { expect } = require('chai');
const { graphql } = require('graphql');
const { unbase64, base64 } = require('relay-sequelize/lib/utils/base64');

import app from "../data/app";

describe('ACL', function () {
  const user = {
    _dataValues: {
      id: 3,
      roles: {admin: true}
    },
    get: (k) => {return user._dataValues[k]}
  };

  const user2 = {
    _dataValues: {
      id: 1
    },
    get: (k) => {return user2._dataValues[k]}
  };
  
  it('should raise acl user create', function () {
    const mutationQuery = `
      mutation CreateUserAcl($input: createUserInput!) {
        createUser(input: $input) {
          userEdge {
            node {
              id
              email
              firstName
              lastName
              todos {
                total
              }
            }
          }
        }
      }
    `;

    const mutationVariables = {
      input: {
        email: "acl1@gmail.com",
        password: "azerty",
        firstName: "firtname acl 1",
        lastName: "lastname acl 1"
      }
    };

    const context = {
      usercreate: true,
      user: user
    };
    return graphql(GraphQLSchema, mutationQuery, {}, context, mutationVariables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.createUser).to.be.null;
      expect(result.errors).to.not.undefined;
      expect(result.errors[0].message).to.equals('acl user create');

      return true;
    })
  })
  it('should not raise acl user create', function () {
    const mutationQuery = `
      mutation CreateUserAcl($input: createUserInput!) {
        createUser(input: $input) {
          userEdge {
            node {
              id
              email
              firstName
              lastName
              todos {
                total
              }
            }
          }
        }
      }
    `;

    const mutationVariables = {
      input: {
        email: "acl1@gmail.com",
        password: "azerty",
        firstName: "firtname acl 1",
        lastName: "lastname acl 1"
      }
    };

    const context = {
      usercreate: false,
      user: user
    };

    return graphql(GraphQLSchema, mutationQuery, {}, context, mutationVariables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.createUser).to.not.null;
      const { id, email, firstName, lastName, todos } = result.data.createUser.userEdge.node;
      expect(unbase64(id)).to.be.eq("User:4");
      expect(email).to.be.eq("acl1@gmail.com");
      expect(firstName).to.be.eq("firtname acl 1");
      expect(lastName).to.be.eq("lastname acl 1");
      expect(todos).to.not.undefined;
      expect(todos.total).to.be.eq(0);
      expect(result.errors).to.undefined;

      return true;
    })
  })
  it('should raise acl user update', function () {
    const mutationQuery = `
      mutation UpdateUserAcl($input: updateUserInput!) {
        updateUser(input: $input) {
          userEdge {
            node {
              id
              email
              firstName
              lastName
              todos {
                total
              }
            }
          }
        }
      }
    `;

    const mutationVariables = {
      input: {
        id: base64("User:2"),
        email: "acl1_updated@gmail.com"
      }
    };

    const context = {
      userupdate: true,
      user: user
    };

    return graphql(GraphQLSchema, mutationQuery, {}, context, mutationVariables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.updateUser).to.be.null;
      expect(result.errors).to.not.undefined;
      expect(result.errors[0].message).to.be.eq("acl user update");

      return true;
    })
  })
  it('should not raise acl user update', function () {
    const mutationQuery = `
      mutation UpdateUserAcl($input: updateUserInput!) {
        updateUser(input: $input) {
          userEdge {
            node {
              id
              email
              firstName
              lastName
              todos {
                total
              }
            }
          }
        }
      }
    `;

    const mutationVariables = {
      input: {
        id: base64("User:2"),
        email: "acl1_updated@gmail.com"
      }
    };

    const context = {
      userupdate: false,
      user: user
    };

    return graphql(GraphQLSchema, mutationQuery, {}, context, mutationVariables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.updateUser).to.not.null;

      const { id, email, todos } = result.data.updateUser.userEdge.node;

      expect(unbase64(id)).to.be.eq("User:2");
      expect(email).to.be.eq("acl1_updated@gmail.com");
      expect(todos).to.not.undefined;
      expect(todos.total).to.be.eq(1);
      expect(result.errors).to.undefined;

      return true;
    })
  })
  it('should raise acl user delete 1', function () {
    const mutationQuery = `
      mutation DeleteUserAcl($input: deleteUserInput!) {
        deleteUser(input: $input) {
          userEdge {
            node {
              id
              email
              firstName
              lastName
              todos {
                total
              }
            }
          }
        }
      }
    `;

    const mutationVariables = {
      input: {
        id: base64("User:2")
      }
    };

    const context = {
      userdelete1: true,
      userdelete2: true,
      user: user
    };

    return graphql(GraphQLSchema, mutationQuery, {}, context, mutationVariables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.deleteUser).to.be.null;
      expect(result.errors).to.not.undefined;
      expect(result.errors[0].message).to.be.eq("acl user delete 1");

      return true;
    })
  })
  it('should raise acl user delete 2', function () {
    const mutationQuery = `
      mutation DeleteUserAcl($input: deleteUserInput!) {
        deleteUser(input: $input) {
          userEdge {
            node {
              id
              email
              firstName
              lastName
              todos {
                total
              }
            }
          }
        }
      }
    `;

    const mutationVariables = {
      input: {
        id: base64("User:3")
      }
    };

    const context = {
      userdelete2: true,
      user: user
    };

    return graphql(GraphQLSchema, mutationQuery, {}, context, mutationVariables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.deleteUser).to.be.null;
      expect(result.errors).to.not.undefined;
      expect(result.errors[0].message).to.be.eq("acl user delete 2");

      return true;
    })
  })
  it('should not raise acl user delete', function () {
    const mutationQuery = `
      mutation DeleteUserAcl($input: deleteUserInput!) {
        deleteUser(input: $input) {
          userEdge {
            node {
              id
              email
              firstName
              lastName
              todos {
                total
              }
            }
          }
        }
      }
    `;

    const mutationVariables = {
      input: {
        id: base64("User:2")
      }
    };

    const context = {
      userdelete1: false,
      userdelete2: false,
      user: user
    };

    return graphql(GraphQLSchema, mutationQuery, {}, context, mutationVariables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.deleteUser).to.not.null;

      const { id, email, todos } = result.data.deleteUser.userEdge.node;

      expect(unbase64(id)).to.be.eq("User:2");
      expect(email).to.be.eq("acl1_updated@gmail.com");
      expect(todos).to.not.undefined;
      expect(todos.total).to.be.eq(0);
      expect(result.errors).to.undefined;

      return true;
    })
  })
  it('should raise acl user find 1', function () {
    const query = `
      query GetUserAcl($id: String!) {
        user(id: $id) {
          node {
            id
            email
            firstName
            lastName
            todos {
              total
            }
          }
        }
      }
    `;

    const variables = {
      id: base64("User:1")
    };

    const context = {
      userfind1: true,
      user: user
    };
    return graphql(GraphQLSchema, query, {}, context, variables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.user).to.be.null;
      expect(result.errors).to.not.undefined;
      expect(result.errors[0].message).to.equals('acl user find 1');

      return true;
    })
  })
  it('should not raise acl user find', function () {
    const query = `
      query GetUserAcl($id: String!) {
        user(id: $id) {
          node {
            id
            email
            firstName
            lastName
            todos {
              total
            }
          }
        }
      }
    `;

    const variables = {
      id: base64("User:1")
    };

    const context = {
      userfind1: false,
      user: user
    };

    return graphql(GraphQLSchema, query, {}, context, variables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.user).to.not.null;
      const { id, email, firstName, lastName, todos } = result.data.user.node;
      expect(unbase64(id)).to.be.eq("User:1");
      expect(email).to.be.eq("user1@gmail.com");
      expect(firstName).to.be.eq("firstName1");
      expect(lastName).to.be.eq("lastName1");
      expect(todos).to.not.undefined;
      expect(todos.total).to.be.eq(3);
      expect(result.errors).to.undefined;

      return true;
    })
  })
  it('should raise acl todo find 1', function () {
    const query = `
      query GetTodoAcl($id: String!) {
        todo(id: $id) {
          node {
            id
            text
            completed
            createdBy {
              id
            }
          }
        }
      }
    `;

    const variables = {
      id: base64("Todo:1")
    };

    const context = {
      todofind1: true
    };

    return graphql(GraphQLSchema, query, {}, context, variables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.todo).to.be.null;
      expect(result.errors).to.not.undefined;
      expect(result.errors[0].message).to.equals('acl todo find 1');

      return true;
    })
  })
  it('should raise acl todo find 2', function () {
    const query = `
      query GetTodoAcl($id: String!) {
        todo(id: $id) {
          node {
            id
            text
            completed
            createdBy {
              id
            }
          }
        }
      }
    `;

    const variables = {
      id: base64("Todo:1")
    };

    const context = {
      todofind2: true
    };

    return graphql(GraphQLSchema, query, {}, context, variables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.todo).to.be.null;
      expect(result.errors).to.not.undefined;
      expect(result.errors[0].message).to.equals('acl todo find 2');

      return true;
    })
  })
  it('should rnot find todo', function () {
    const query = `
      query GetTodoAcl($id: String!) {
        todo(id: $id) {
          node {
            id
            text
            completed
            createdBy {
              id
            }
          }
        }
      }
    `;

    const variables = {
      id: base64("Todo:1")
    };

    const context = {
      todofind1: false,
      todofind2: false
    };

    return graphql(GraphQLSchema, query, {}, context, variables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.todo).to.null;

      return true;
    })
  })
  it('should not raise acl todo create', function () {
    const query = `
      query GetTodoAcl($id: String!) {
        todo(id: $id) {
          node {
            id
            text
            completed
            createdBy {
              id
            }
          }
        }
      }
    `;

    const variables = {
      id: base64("Todo:1")
    };

    const context = {
      todofind1: false,
      todofind2: false,
      user: user2
    };

    return graphql(GraphQLSchema, query, {}, context, variables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.todo).to.not.null;
      const { id, text, completed, createdBy } = result.data.todo.node;
      expect(unbase64(id)).to.be.eq("Todo:1");
      expect(text).to.be.eq("User has to be great");
      expect(completed).to.be.eq(true);
      expect(createdBy).to.not.undefined;
      expect(unbase64(createdBy.id)).to.be.eq("User:1");

      return true;
    })
  })
  it('should raise acl todo policy 1', function () {
    const mutationQuery = `
      mutation CreateTodoAcl($input: createTodoInput!) {
        createTodo(input: $input) {
          todoEdge {
            node {
              id
              text
              completed
              createdBy {
                id
              }
            }
          }
        }
      }
    `;

    const mutationVariables = {
      input: {
        text: "Alibaba",
        completed: false
      }
    };

    const context = {
      todopolicy1: true,
      user: user
    };
    return graphql(GraphQLSchema, mutationQuery, {}, context, mutationVariables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.createTodo).to.be.null;
      expect(result.errors).to.not.undefined;
      expect(result.errors[0].message).to.equals('acl todo policy 1');

      return true;
    })
  })
  it('should not raise acl todo policy 1', function () {
    const mutationQuery = `
      mutation CreateTodoAcl($input: createTodoInput!) {
        createTodo(input: $input) {
          todoEdge {
            node {
              id
              text
              completed
              createdBy {
                id
              }
            }
          }
        }
      }
    `;

    const mutationVariables = {
      input: {
        text: "Alibaba",
        completed: false
      }
    };

    const context = {
      todopolicy1: false,
      user: user
    };

    return graphql(GraphQLSchema, mutationQuery, {}, context, mutationVariables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.createTodo).to.not.null;
      const { id, text, completed, createdBy } = result.data.createTodo.todoEdge.node;
      expect(unbase64(id)).to.be.eq("Todo:7");
      expect(text).to.be.eq("Alibaba");
      expect(completed).to.be.eq(false);
      expect(createdBy).to.not.undefined;
      expect(unbase64(createdBy.id)).to.be.eq("User:3");
      expect(result.errors).to.undefined;

      return true;
    })
  })
   it('should raise acl todo all 1', function () {
    const mutationQuery = `
      mutation UpdateTodoAcl($input: updateTodoInput!) {
        updateTodo(input: $input) {
          todoEdge {
            node {
              id
              text
              completed
            }
          }
        }
      }
    `;

    const mutationVariables = {
      input: {
        id: base64("Todo:5"),
        text: "Updated",
        completed: false
      }
    };

    const context = {
      todoAll: true,
      user: user
    };

    return graphql(GraphQLSchema, mutationQuery, {}, context, mutationVariables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.updateTodo).to.be.null;
      expect(result.errors).to.not.undefined;
      expect(result.errors[0].message).to.be.eq("acl todo all 1");

      return true;
    })
  })
  it('should not raise acl todo all 1', function () {
    const mutationQuery = `
      mutation UpdateTodoAcl($input: updateTodoInput!) {
        updateTodo(input: $input) {
          todoEdge {
            node {
              id
              text
              completed
            }
          }
        }
      }
    `;

    const mutationVariables = {
      input: {
        id: base64("Todo:5"),
        text: "Updated",
        completed: false
      }
    };

    const context = {
      todoAll: false,
      user: user
    };

    return graphql(GraphQLSchema, mutationQuery, {}, context, mutationVariables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.updateTodo).to.not.null;

      const { id, text, completed } = result.data.updateTodo.todoEdge.node;

      expect(unbase64(id)).to.be.eq("Todo:5");
      expect(text).to.be.eq("Updated");
      expect(completed).to.be.eq(false);

      return true;
    })
  }) 
  it('should not raise acl todo create', function () {
    const query = `
      query {
        articles {
          id
          content
          visibility
          createdBy {
            id
          }
        }
      }
    `;

    return graphql(GraphQLSchema, query, {}, {}).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.articles).to.not.null;

      const { id, content, visibility, createdBy } = result.data.articles[0];
      expect(unbase64(id)).to.be.eq("Article:1");
      expect(content).to.be.eq("Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...");
      expect(visibility).to.be.eq(false);
      expect(createdBy).to.not.undefined;
      expect(unbase64(createdBy.id)).to.be.eq("User:1");

      return true;
    })
  })
})