import { heroes } from '../data';
import { makeMovie } from './movies';

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
  const heroesByName = name && heroes.filter(h => h.name.match(new RegExp(name, 'i')));
  const heroesByPower = power && heroes.filter(h => h.powers.includes(power));

  const finalHeroes = heroesByName || heroesByPower || heroes;

  return finalHeroes.map(makeHero);
};

export const heroRoot = {
  heroes: heroesResolver,
  randomHero: () => getRandom(heroesResolver()),
};
