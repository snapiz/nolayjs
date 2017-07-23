const { expect } = require('chai');
const { graphql } = require('graphql');
const { unbase64, base64 } = require('relay-sequelize/lib/utils/base64');

import app from "../data/app";

describe('User middleware', function () {
  it('should define query', function () {
    return graphql(app.get('schema'), `
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
})