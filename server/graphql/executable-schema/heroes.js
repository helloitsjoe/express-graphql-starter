import { makeMovie } from '../models';
import { getRandom } from '../../utils';

// Note that we can use types defined in other files
export const heroSchema = `
  type Hero {
    "Hero's name"
    name(shouldUpperCase: Boolean): String!
    "Hero's powers"
    powers: [String!]!
    "Movies the hero has appeared in"
    movies: [Movie!]!
  }

  extend type Query {
    "Heroes by name"
    heroes(names: [String]): [Hero!]!
    "All heroes, optionally filtered by power"
    allHeroes(power: String): [Hero!]!
    "Get a random hero"
    randomHero: Hero!
  }
`;

export const heroRoot = {
  Query: {
    heroes: (_, { names } = {}, { db }) => db.hero.fetch(names),
    allHeroes: (_, { power } = {}, { db }) => db.hero.fetch(null, power),
    randomHero: (_, args, { db }) => db.hero.fetch().then(getRandom),
  },
  Hero: {
    name: ({ name }, { shouldUpperCase = false }) => (shouldUpperCase ? name.toUpperCase() : name),
    movies: ({ movies }, args, { db }) => movies.map(title => makeMovie({ title, db })),
  },
};
