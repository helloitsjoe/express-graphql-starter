// const express = require('express');
// const gqlHTTP = require('express-graphql');
const { ApolloServer } = require('apollo-server-express');
const {
  // schema,
  // rootValue,
  typeDefs,
  resolvers,
} = require('../graphql/rootSchemas');
const makeDB = require('../graphql/data');

const graphql = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  context: { data: makeDB({ delay: 250 }) },
});

// const gql = gqlHTTP(request => ({
//   schema,
//   rootValue,
//   graphiql: true,
//   context: { request, data },
// }));

// const router = express.Router();

// router.post('/', gql);
// router.get('/', gql);

// module.exports = router;
module.exports = graphql;
