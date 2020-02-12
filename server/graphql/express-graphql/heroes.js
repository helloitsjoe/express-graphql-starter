// import data from '../data';
import { makeMovie } from './movies';
import { matchName } from '../../utils';

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

const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];

// TODO: Import this from models.js
export const makeHero = ({ name, powers, movies }) => {
  return {
    powers,
    name: ({ shouldUppercase = false }) => (shouldUppercase ? name.toUpperCase() : name),
    movies: () => movies.map(movieName => makeMovie({ name: movieName })),
  };
};

const heroesResolver = async ({ name, power } = {}, { data }) => {
  const heroes = await data.fetchHeroes(name, power);
  return heroes.map(makeHero);
};

const randomHeroResolver = async (_, { data }) =>
  data
    .fetchHeroes()
    .then(getRandom)
    .then(makeHero);

export const heroRoot = {
  heroes: heroesResolver,
  randomHero: randomHeroResolver,
};
