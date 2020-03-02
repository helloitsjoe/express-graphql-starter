const express = require('express');
const gqlHTTP = require('express-graphql');
const { schema, rootValue } = require('../graphql/rootSchemas');
const { makeAPI } = require('../graphql/db');
const makeData = require('../graphql/mockData');

const gql = gqlHTTP(request => ({
  schema,
  rootValue,
  graphiql: true,
  context: { request, db: makeAPI(makeData({ delay: 250 })) },
}));

const router = express.Router();

router.post('/', gql);
router.get('/', gql);

module.exports = router;
