/* eslint-disable max-classes-per-file */
import { makeMovie } from '../models';
import { getRandom } from '../../utils';

export const villainSchema = `
  type Villain {
    "Villain's name"
    name(shouldUpperCase: Boolean): String!
    "Villain's powers"
    powers: [String!]!
    "Movies the villain has appeared in"
    movies: [Movie!]!
  }

  extend type Query {
    "Villains filtered by name or power"
    villains(name: String, power: String): [Villain!]!
    "Get a random villain"
    randomVillain: Villain!
  }
`;

const villains = async (_, { name, power }, { data }) => {
  const villainsData = await data.fetchVillains(name, power);
  return villainsData;
};

const randomVillain = async (_, args, { data }) => {
  const villainsData = await data.fetchVillains();
  return getRandom(villainsData);
};

export const villainRoot = {
  // Query: new VillainQuery(),
  Query: {
    villains,
    randomVillain,
  },
  Villain: {
    name: ({ name }, { shouldUpperCase = false }) => (shouldUpperCase ? name.toUpperCase() : name),
    movies: ({ movies }, args, { data }) => {
      return movies.map(movieName => makeMovie({ name: movieName, data }));
    },
  },
};
