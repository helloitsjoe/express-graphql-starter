const express = require('express');
const gqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const router = express.Router();

const places = ['World', 'Mars'];

const schema = buildSchema(`
  type Query {
    places: [String]
  }

  type Mutation {
    place(name: String!): String
    add(name: String!): [String]
  }
`);

const rootValue = {
  place: args => {
    console.log(`args:`, args);
    const placeIsKnown = places.includes(args.name);
    if (!placeIsKnown) return `I don't know where ${args.name} is!`;
    return args.name;
  },
  places,
  add: args => {
    places.push(args.name);
    return places;
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
