const express = require('express');
const gqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const router = express.Router();

const places = ['World', 'Mars'];

const schema = buildSchema(`
  type Query {
    place(name: String!): String
    places: [String]
  }

  type Mutation {
    add(name: String!): [String]
  }
`);

const rootValue = {
  place: args => {
    return new Promise(resolve => {
      setTimeout(() => {
        const placeIsKnown = places.includes(args.name);
        if (!placeIsKnown) return resolve(`I don't know where ${args.name} is!`);
        return resolve(args.name);
      }, 500);
    });
  },
  places,
  add: args => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        places.push(args.name);
        return reject(new Error('nooo'));
        // return resolve(places);
      }, 500);
    });
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
