const { buildSchema } = require('graphql');

const places = ['World', 'Mars'];

const planetSchema = buildSchema(`
  type Query {
    place(name: String!): String
    places: [String]
  }

  type Mutation {
    add(name: String!): [String]
  }
`);

// TODO: Rename places to planets
const planetRoot = {
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
        // return reject(new Error('nooo'));
        return resolve(places);
      }, 500);
    });
  },
};

module.exports = {
  planetRoot,
  planetSchema,
};
