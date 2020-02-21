// NOTE: graphql's `buildSchema` is very limited. Currently you can't
// define resolvers for individual types, so you can't do deep queries
// i.e. Hero -> Movie -> Hero... graphql-tools `makeExecutableSchema`
// is a better solution.

import { makeMovie } from '../models';
import { getRandom } from '../../utils';

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

export const heroResolver = ({ name, powers, movies }) => {
  return {
    powers,
    name: ({ shouldUppercase = false }) => (shouldUppercase ? name.toUpperCase() : name),
    movies: (args, { db }) => {
      return movies.map(movieName => makeMovie({ name: movieName, db }));
    },
  };
};

const heroesResolver = async ({ name, power } = {}, { db }) => {
  const heroes = await db.fetchHeroes(name, power);
  // const heroModels = heroes.map(h => makeHero({ name: h.name, db }));
  return heroes.map(heroResolver);
};

const randomHeroResolver = async (args, { db }) => {
  const heroes = await db.fetchHeroes();
  return heroResolver(getRandom(heroes));
};

export const heroRoot = {
  heroes: heroesResolver,
  randomHero: randomHeroResolver,
};
