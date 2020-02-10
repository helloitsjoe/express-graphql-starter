const { buildSchema } = require('graphql');

const initialPlanets = ['World', 'Mars'];
let planets = [...initialPlanets];

const planetSchema = buildSchema(`
  type Query {
    "A single planet"
    planet(name: String!): String
    "All planets"
    planets: [String]
  }

  type Mutation {
    "Add a new planet"
    addPlanet(name: String!): [String]
  }
`);

const planetRoot = {
  planet: args => {
    const planetIsKnown = planets.includes(args.name);
    if (!planetIsKnown) return Promise.resolve(`I don't know where ${args.name} is!`);
    return Promise.resolve(args.name);
  },
  planets,
  addPlanet: args => {
    planets.push(args.name);
    // return reject(new Error('nooo'));
    return Promise.resolve(planets);
  },
};

const resetPlanets = () => {
  planets = [...initialPlanets];
};

module.exports = {
  planetRoot,
  planetSchema,
  resetPlanets,
};
