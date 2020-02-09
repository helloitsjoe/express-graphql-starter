import data from '../data';
import { makeMovie } from './movies';
import { matchName } from '../../utils';

export const heroSchema = `
  type Hero {
    name(shouldUppercase: Boolean): String!
    powers: [String!]!
    movies: [Movie!]!
  }

  type Query {
    heroes(name: String, power: String): [Hero!]!
    randomHero: Hero!
  }
`;

const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];

export const makeHero = ({ name, powers, movies }) => {
  return {
    powers,
    name: ({ shouldUppercase = false }) => (shouldUppercase ? name.toUpperCase() : name),
    movies: () => movies.map(movieName => makeMovie({ name: movieName })),
  };
};

const heroesResolver = ({ name, power } = {}) => {
  const heroes = data.heroes
    .filter(h => !name || matchName(h, name))
    .filter(h => !power || h.powers.includes(power))
    .map(makeHero);

  return heroes;
};

export const heroRoot = {
  heroes: heroesResolver,
  randomHero: () => getRandom(heroesResolver()),
};
