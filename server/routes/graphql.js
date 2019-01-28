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

const gql = gqlHTTP({
  schema,
  rootValue,
  graphiql: true,
});

router.get('/', gql);
router.post('/', gql);

module.exports = router;
