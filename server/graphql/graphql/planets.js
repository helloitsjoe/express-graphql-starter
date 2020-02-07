const { buildSchema } = require('graphql');

const planets = ['World', 'Mars'];

const planetSchema = buildSchema(`
  type Query {
    planet(name: String!): String
    planets: [String]
  }

  type Mutation {
    addPlanet(name: String!): [String]
  }
`);

const planetRoot = {
  planet: args => {
    return new Promise(resolve => {
      setTimeout(() => {
        const planetIsKnown = planets.includes(args.name);
        if (!planetIsKnown) return resolve(`I don't know where ${args.name} is!`);
        return resolve(args.name);
      }, 500);
    });
  },
  planets,
  addPlanet: args => {
    return new Promise(resolve => {
      setTimeout(() => {
        planets.push(args.name);
        // return reject(new Error('nooo'));
        return resolve(planets);
      }, 500);
    });
  },
};

module.exports = {
  planetRoot,
  planetSchema,
};
