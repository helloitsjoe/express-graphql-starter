const express = require('express');
const gqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const router = express.Router();

const places = {
  World: 'World',
  Mars: 'Mars',
};

const schema = buildSchema(`
  type Query {
    place(name: String!): String
  }

  type Mutation {
    add(name: String!): String
  }
`);

const rootValue = {
  place: args => {
    const place = places[args.name];
    if (!place) return `I don't know where ${args.name} is!`;
    return place;
  },
  add: args => {
    places[args.name] = args.name;
    return places[args.name];
  },
};

const gql = gqlHTTP(request => ({
  schema,
  rootValue,
  graphiql: true,
  context: { request, test: 'hello' },
}));

router.post('/', gql);
router.get('/', gql);

module.exports = router;
