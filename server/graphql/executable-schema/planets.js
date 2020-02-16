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
  Query: {
    planet: (_, args) => {
      const planetIsKnown = planets.includes(args.name);
      if (!planetIsKnown) return Promise.resolve(`I don't know where ${args.name} is!`);
      return Promise.resolve(args.name);
    },
    planets: () => planets,
  },
  Mutation: {
    addPlanet: (_, args) => {
      planets.push(args.name);
      return Promise.resolve(planets);
    },
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
