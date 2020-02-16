import { makeMovie } from '../models';
import { getRandom } from '../../utils';

// Note that we can use types defined in other files
export const heroSchema = `
  type Hero {
    "Hero's name"
    name(shouldUppercase: Boolean): String!
    "Hero's powers"
    powers: [String!]!
    "Movies the hero has appeared in"
    movies: [Movie!]!
  }

  extend type Query {
    "Heroes filtered by name or power"
    heroes(name: String, power: String): [Hero!]!
    "Get a random hero"
    randomHero: Hero!
  }
`;

export const heroRoot = {
  Query: {
    heroes: (_, args = {}, { data }) => data.fetchHeroes(args.name, args.power),
    randomHero: async (_, args, { data }) => {
      const heroes = await data.fetchHeroes();
      return getRandom(heroes);
    },
  },
  Hero: {
    name: ({ name }, { shouldUppercase = false }) => (shouldUppercase ? name.toUpperCase() : name),
    movies: ({ movies }, args, { data }) => movies.map(name => makeMovie({ name, data })),
  },
};
