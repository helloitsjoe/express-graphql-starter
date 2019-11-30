const express = require('express');
const gqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const router = express.Router();

const places = ['World', 'Mars'];

const schema = buildSchema(`
  type Query {
    places: [String]
    place(name: String!): String
  }

  type Mutation {
    add(name: String!): [String]
  }
`);

const rootValue = {
  place: args => {
    console.log(`args:`, args);
    return new Promise(resolve => {
      setTimeout(() => {
        if (!args.name) return resolve('');
        const placeIsKnown = places.includes(args.name);
        if (!placeIsKnown) return resolve(`I don't know where ${args.name} is!`);
        resolve(args.name);
      }, 500);
    });
  },
  places,
  add: args => {
    places.push(args.name);
    console.log('places:', places);
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
