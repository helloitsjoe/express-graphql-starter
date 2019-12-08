const express = require('express');
const gqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const router = express.Router();

const places = [{ id: 0, name: 'World' }, { id: 1, name: 'Mars' }];

let { id } = places[places.length - 1];

const schema = buildSchema(`
  type Place {
    id: ID!
    name: String!
  }

  type Query {
    places: [Place]
    place(name: String!): Place
  }

  type Mutation {
    add(name: String!): [Place]
  }
`);

const rootValue = {
  place: args => {
    console.log(`args:`, args);
    return new Promise(resolve => {
      setTimeout(() => {
        if (!args.name) return resolve('');
        const foundPlace = places.find(place => place.name.includes(args.name));
        if (!foundPlace) return resolve(`I don't know where ${args.name} is!`);
        return resolve(foundPlace);
      }, 500);
    });
  },
  places,
  add: args => {
    return new Promise(resolve => {
      setTimeout(() => {
        id++;
        const { name } = args;
        places.push({ id, name });
        console.log('places:', places);
        return resolve(places);
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
