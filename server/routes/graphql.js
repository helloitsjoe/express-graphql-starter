const express = require('express');
const gqlHTTP = require('express-graphql');
const { schema, rootValue } = require('../graphql/rootSchemas');
const data = require('../graphql/data');

const gql = gqlHTTP(request => ({
  schema,
  rootValue,
  graphiql: true,
  context: { request, data },
}));

const router = express.Router();

router.post('/', gql);
router.get('/', gql);

module.exports = router;
