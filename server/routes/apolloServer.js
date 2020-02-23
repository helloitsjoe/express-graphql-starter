const { ApolloServer } = require('apollo-server-express');
const { schema } = require('../graphql/rootSchemas');
// const { makeAPI, withLoaders } = require('../graphql/db');
const { makeDB, makeLoaders } = require('../graphql/db');

const server = new ApolloServer({
  schema,
  tracing: true,
  // context: { db: withLoaders(makeAPI({ delay: 250 })) },
  context: { db: { ...makeDB({ delay: 250 }), ...makeLoaders() } },
});

module.exports = server;
