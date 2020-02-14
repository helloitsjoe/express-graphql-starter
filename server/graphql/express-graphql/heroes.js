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

  type Query {
    "Heroes filtered by name or power"
    heroes(name: String, power: String): [Hero!]!
    "Get a random hero"
    randomHero: Hero!
  }
`;

// export const heroResolver = ({ name, powers, movies }) => {
//   console.log(`name:`, name);
//   return {
//     powers,
//     name: ({ shouldUppercase = false }) => (shouldUppercase ? name.toUpperCase() : name),
//     movies: (args, { data }) => {
//       return movies.map(movieName => makeMovie({ name: movieName, data }));
//     },
//   };
// };

export class Hero {
  constructor({ name, powers, movies }) {
    console.log(`name:`, name);
    this.powers = powers;
    this.name = ({ shouldUppercase = false }) => (shouldUppercase ? name.toUpperCase() : name);
    this.movies = (args, { data }) => {
      return movies.map(movieName => makeMovie({ name: movieName, data }));
    };
  }
}

const heroesResolver = async ({ name, power } = {}, { data }) => {
  const heroes = await data.fetchHeroes(name, power);
  // const heroModels = heroes.map(h => makeHero({ name: h.name, data }));
  return heroes.map(h => new Hero(h));
};

const randomHeroResolver = async (args, { data }) => {
  const heroes = await data.fetchHeroes();
  return new Hero(getRandom(heroes));
  // return heroResolver(getRandom(heroes));
};

export const heroRoot = {
  heroes: heroesResolver,
  randomHero: randomHeroResolver,
};
