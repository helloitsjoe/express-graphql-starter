// import { VillainType } from './villains';
// import { heroResolver } from './heroes';
import { makeHero, Villain } from '../models';
import { getRandom } from '../../utils';

// Note that we can use types defined in other files
export const movieSchema = `
  type Movie {
    "Movie name"
    name: String!
    "Heroes in movie"
    heroes: [Hero!]!
    "Villains in movie"
    villains: [Villain!]!
  }

  type Query {
    "Movies filtered by name or castMemberName"
    movies(name: String, castMemberName: String): [Movie!]!
    "Get a random movie"
    randomMovie: Movie!
  }
`;

// export const movieResolver = async ({ name, heroes, villains }) => {
//   // const [movie] = await data.fetchMovies(name);
//   console.log(`heroes:`, heroes);
//   console.log(`villains:`, villains);
//   return {
//     name,
//     heroes: (args, { data }) => heroes.map(heroName => makeHero({ name: heroName, data })),
//     villains: (args, { data }) =>
//       villains.map(villainName => new Villain().init({ name: villainName, data })),
//   };
// };

export class Movie {
  // async init({ name, heroes, villains }) {
  constructor({ name, heroes, villains }) {
    console.log(`heroes:`, heroes);
    this.name = name;
    this.heroes = (args, { data }) => heroes.map(heroName => makeHero({ name: heroName, data }));
    this.villains = (args, { data }) =>
      villains.map(villainName => new Villain().init({ name: villainName, data }));
  }
}

const moviesResolver = async ({ name, castMemberName } = {}, { data }) => {
  const movies = await data.fetchMovies(name, castMemberName);
  return movies.map(m => new Movie(m));
};

const randomMovieResolver = async (args, { data }) => {
  const movies = await data.fetchMovies();
  return movieResolver(getRandom(movies));
};

export const movieRoot = {
  movies: moviesResolver,
  randomMovie: randomMovieResolver,
};
