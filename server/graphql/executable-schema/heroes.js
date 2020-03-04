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
    hero(name: String): Hero!
    "Fetch multiple heroes by providing an array of ids"
    heroes(ids: [Int]): [Hero!]!
    "All heroes, optionally filtered by power"
    allHeroes(power: String): [Hero!]!
    "Get a random hero"
    randomHero: Hero!
  }
`;

export const heroRoot = {
  Query: {
    hero: (_, { name } = {}, { db }) => db.hero.fetchByName(name),
    heroes: (_, { ids } = {}, { db }) => db.hero.fetchByIds(ids),
    allHeroes: (_, { power } = {}, { db }) => db.hero.fetchAll(power),
    randomHero: (_, args, { db }) => db.hero.fetchAll().then(getRandom),
  },
  Hero: {
    name: ({ name }, { shouldUpperCase = false }) => (shouldUpperCase ? name.toUpperCase() : name),
    movies: ({ movies }, args, { db }) => movies.map(title => makeMovie({ title, db })),
  },
};
