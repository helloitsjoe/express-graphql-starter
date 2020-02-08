const express = require('express');
const gqlHTTP = require('express-graphql');
const { schema, rootValue } = require('../graphql/rootSchemas');

const gql = gqlHTTP(request => ({
  schema,
  rootValue,
  graphiql: true,
  context: { request },
}));

const router = express.Router();

router.post('/', gql);
router.get('/', gql);

module.exports = router;
