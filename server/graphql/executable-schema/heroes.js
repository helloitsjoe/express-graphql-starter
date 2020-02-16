/* eslint-disable import/no-cycle */
import { makeMovie, makeHero } from '../models';
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

const heroesResolver = async (_, { name, power } = {}, { data }) => {
  const heroes = await data.fetchHeroes(name, power);
  // const heroModels = heroes.map(h => makeHero({ name: h.name, data }));
  // return heroes.map(heroResolver);
  // console.log(`heroes:`, heroes);
  return heroes;
};

const randomHeroResolver = async (_, args, { data }) => {
  const heroes = await data.fetchHeroes();
  return getRandom(heroes);
};

export const heroRoot = {
  Query: {
    heroes: heroesResolver,
    randomHero: randomHeroResolver,
  },
  Hero: {
    powers: ({ powers }) => powers,
    name: ({ name }, { shouldUppercase = false }) => (shouldUppercase ? name.toUpperCase() : name),
    movies: ({ movies }, args, { data }) => {
      return movies.map(movieName => makeMovie({ name: movieName, data }));
    },
  },
};
