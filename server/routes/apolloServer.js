const { ApolloServer } = require('apollo-server-express');
const { schema } = require('../graphql/rootSchemas');
const { makeAPI } = require('../graphql/db');

const server = new ApolloServer({
  schema,
  tracing: true,
  context: ({ req }) => ({ req, db: makeAPI({ delay: 250 }) }),
  playground: {
    settings: {
      'schema.polling.enable': false,
    },
  },
});

module.exports = server;
