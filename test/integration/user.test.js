const { expect } = require('chai');
const { graphql } = require('graphql');
const { unbase64, base64 } = require('relay-sequelize/lib/utils/base64');

import app from "../data/app";

describe('User', function () {
  const user = {
    _dataValues: {
      id: 1
    },
    get: (k) => {return user._dataValues[k]}
  };
  it('should define query', function () {
    return graphql(GraphQLSchema, `
        query {
          viewer {
            id
            email
            firstName
            lastName
            todos(first: 2) {
              total
              edges {
                cursor
                node {
                  id
                  text
                  completed
                }
              }
            }
          }
        }
      `).then(function (result) {
        expect(result).to.not.undefined;
        expect(result.data.viewer).to.not.null;

        const { id, email, todos } = result.data.viewer;
        expect(unbase64(id)).to.be.equal('User:1');
        expect(email).to.be.equal('user1@gmail.com');
        expect(todos.total).to.equal(3);
        expect(todos.edges).lengthOf(2);
        expect(unbase64(todos.edges[0].node.id)).to.be.equal('Todo:1');
        expect(todos.edges[0].node.text).to.be.equal('User has to be great');
        expect(todos.edges[0].node.completed).to.be.equal(true);
        expect(unbase64(todos.edges[1].node.id)).to.be.equal('Todo:3');
        expect(todos.edges[1].node.text).to.be.equal('My boat has to be very clean before meeting some girl');
        expect(todos.edges[1].node.completed).to.be.equal(false);

        return true;
      })
  })
  it('should raise "You must be authenticate to perform this action" trying to create todo', function () {
    const query = `
      mutation CreateTodoTest($input: createTodoInput!) {
        createTodo(input: $input) {
          todoEdge {
            node {
              id
              text
            }
          }
        }
      }
    `;

    const context = {};
    const variables = {
      input: {
        text: 'Once upon a time',
        completed: true
      }
    };

    return graphql(GraphQLSchema, query, {}, context, variables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.createTodo).to.be.null;
      expect(result.errors).to.not.undefined;
      expect(result.errors[0].message).to.equals('You must be authenticate to perform this action');

      return true;
    })
  })
  it('should raise "You not allow to perform this action" trying to update todo', function () {
    const query = `
      mutation UpdateTodoTest($input: updateTodoInput!) {
        updateTodo(input: $input) {
          todoEdge {
            cursor
            node {
              id
              text
            }
          }
        }
      }
    `;

    const context = {};
    const variables = {
      input: {
        id: base64('Todo:7'),
        text: 'new text'
      }
    };

    return graphql(GraphQLSchema, query, {}, context, variables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.updateTodo).to.be.null;
      expect(result.errors).to.not.undefined;
      expect(result.errors[0].message).to.equals('You not allow to perform this action');

      return true;
    })
  })
   it('should raise "You not allow to perform this action" trying to delete todo', function () {
    const query = `
      mutation DeleteTodoTest($input: deleteTodoInput!) {
        deleteTodo(input: $input) {
          todoEdge {
            node {
              id
              text
            }
          }
        }
      }
    `;

    const context = {};
    const variables = {
      input: {
        id: base64('Todo:7'),
      }
    };

    return graphql(GraphQLSchema, query, {}, context, variables).then(function (result) {
      expect(result).to.not.undefined;
      expect(result.data).to.not.undefined;
      expect(result.data.deleteTodo).to.be.null;
      expect(result.errors).to.not.undefined;
      expect(result.errors[0].message).to.equals('You not allow to perform this action');

      return true;
    })
  }) 
})