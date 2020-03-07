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
    "Get villain by name (case insensitive)"
    villain(name: String): Villain!
    "Get villains by ids"
    villains(ids: [Int]): [Villain!]!
    "Get all villains, optionally filtered by power"
    allVillains(power: String) : [Villain!]!
    "Get a random villain"
    randomVillain: Villain!
  }
`;

export const villainRoot = {
  Query: {
    villain: (_, { name }, { db }) => db.villain.fetchByName(name),
    villains: (_, { ids }, { db }) => db.villain.fetchByIds(ids),
    allVillains: (_, { power }, { db }) => db.villain.fetchAll(power),
    randomVillain: (_, args, { db }) => db.villain.fetchAll().then(getRandom),
  },
  Villain: {
    name: ({ name }, { shouldUpperCase = false }) => (shouldUpperCase ? name.toUpperCase() : name),
    movies: ({ movies }, args, { db }) => movies.map(title => db.movie.titleLoader.load(title)),
  },
};
