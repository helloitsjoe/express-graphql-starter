// NOTE: graphql's `buildSchema` is very limited. Currently you can't
// define resolvers for individual types, so you can't do deep queries
// i.e. Hero -> Movie -> Hero... graphql-tools `makeExecutableSchema`
// is a better solution.

import { makeHero, makeVillain } from '../models';
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

  extend type Query {
    "Movies filtered by name or castMemberName"
    movies(name: String, castMemberName: String): [Movie!]!
    "Get a random movie"
    randomMovie: Movie!
  }
`;

export const movieResolver = async ({ name, heroes, villains }) => {
  // const [movie] = await data.fetchMovies(name);
  console.log(`heroes:`, heroes);
  return {
    name,
    heroes: (args, { data }) => heroes.map(heroName => makeHero({ name: heroName, data })),
    villains: (args, { data }) =>
      villains.map(villainName => makeVillain({ name: villainName, data })),
  };
};

const moviesResolver = async ({ name, castMemberName } = {}, { data }) => {
  const movies = await data.fetchMovies(name, castMemberName);
  return movies.map(movieResolver);
};

const randomMovieResolver = async (args, { data }) => {
  const movies = await data.fetchMovies();
  return movieResolver(getRandom(movies));
};

export const movieRoot = {
  movies: moviesResolver,
  randomMovie: randomMovieResolver,
};
