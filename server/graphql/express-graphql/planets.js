// NOTE: graphql's `buildSchema` is very limited. Currently you can't
// define resolvers for individual types, so you can't do deep queries
// i.e. Hero -> Movie -> Hero... graphql-tools `makeExecutableSchema`
// is a better solution.

const initialPlanets = ['World', 'Mars'];
let planets = [...initialPlanets];

const planetSchema = `
  extend type Query {
    "A single planet"
    planet(name: String!): String
    "All planets"
    planets: [String]
  }

  extend type Mutation {
    "Add a new planet"
    addPlanet(name: String!): [String]
  }
`;

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
