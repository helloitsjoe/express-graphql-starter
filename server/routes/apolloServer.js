const { ApolloServer } = require('apollo-server-express');
const { schema } = require('../graphql/rootSchemas');
const { makeAPI } = require('../graphql/db');
const makeDB = require('../graphql/mockData');

const server = new ApolloServer({
  schema,
  tracing: true,
  context: ({ req }) => ({ req, db: makeAPI(makeDB({ delay: 250 })) }),
  playground: {
    settings: {
      'schema.polling.enable': false,
    },
  },
});

module.exports = server;
