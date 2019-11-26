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
    getPlace(place: String!): String
  }

  type Mutation {
    createPlace(place: String!): String
  }
`);

const rootValue = {
  getPlace: args => {
    const place = places[args.place];
    if (!place) return `I don't know where ${args.place} is!`;
    // TODO: Return an object with 'place' and move string creation to front end
    return `Hello ${place}!`;
  },
  createPlace: args => {
    places[args.place] = args.place;
    return `You added ${places[args.place]}`;
  },
};

const gql = gqlHTTP({
  schema,
  rootValue,
  graphiql: true,
});

router.post('/', gql);
router.get('/', gql);

module.exports = router;
