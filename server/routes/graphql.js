const express = require('express');
const gqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
// const router = express.Router();

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const rootValue = {
  hello: () => 'Hello world!'
};

module.exports = gqlHTTP({
  schema,
  rootValue,
  graphiql: true
});
