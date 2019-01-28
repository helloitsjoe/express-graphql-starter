const express = require('express');
const gqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const router = express.Router();

const schema = buildSchema(`
  type Query {
    hello(place: String!): String
  }
`);

const rootValue = {
  hello: args => `Hello ${args.place}!`,
};

router.post(
  '/',
  gqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
);

module.exports = router;
