const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('../graphql/rootSchemas');
const { makeDB, makeLoaders } = require('../graphql/db');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  context: { db: { ...makeDB({ delay: 250 }), ...makeLoaders() } },
});

module.exports = server;
