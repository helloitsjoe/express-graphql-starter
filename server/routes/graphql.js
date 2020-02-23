const express = require('express');
const gqlHTTP = require('express-graphql');
const { schema, rootValue } = require('../graphql/rootSchemas');
const { makeDB, makeLoaders } = require('../graphql/db');

const gql = gqlHTTP(request => ({
  schema,
  rootValue,
  graphiql: true,
  context: { request, db: { ...makeDB({ delay: 250 }), ...makeLoaders() } },
}));

const router = express.Router();

router.post('/', gql);
router.get('/', gql);

module.exports = router;
