/* eslint-disable import/no-cycle */
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

  type Query {
    "Heroes filtered by name or power"
    heroes(name: String, power: String): [Hero!]!
    "Get a random hero"
    randomHero: Hero!
  }
`;

// TODO: Import this from models.js
export const heroResolver = ({ name, powers, movies }) => {
  return {
    powers,
    name: ({ shouldUppercase = false }) => (shouldUppercase ? name.toUpperCase() : name),
    movies: (args, { data }) => {
      return movies.map(movieName => makeMovie({ name: movieName, data }));
      // return movies.map(movieName => data.fetchMovies(movieName));
    },
  };
};

const heroesResolver = async ({ name, power } = {}, { data }) => {
  const heroes = await data.fetchHeroes(name, power);
  return heroes.map(heroResolver);
};

const randomHeroResolver = async (args, { data }) => {
  const heroes = await data.fetchHeroes();
  return heroResolver(getRandom(heroes));
};

export const heroRoot = {
  heroes: heroesResolver,
  randomHero: randomHeroResolver,
};
