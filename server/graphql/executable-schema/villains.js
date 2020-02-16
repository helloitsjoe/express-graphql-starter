import { makeMovie } from '../models';
import { getRandom } from '../../utils';

// Note that we can use types defined in other files
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

export const villainRoot = {
  Query: {
    villains: (_, args = {}, { data }) => data.fetchVillains(args.name, args.power),
    randomVillain: async (_, args, { data }) => {
      const villainsData = await data.fetchVillains();
      return getRandom(villainsData);
    },
  },
  Villain: {
    name: ({ name }, { shouldUpperCase = false }) => (shouldUpperCase ? name.toUpperCase() : name),
    movies: ({ movies }, args, { data }) => movies.map(name => makeMovie({ name, data })),
  },
};
