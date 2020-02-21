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
  // const [movie] = await db.fetchMovies(name);
  console.log(`heroes:`, heroes);
  return {
    name,
    heroes: (args, { db }) => heroes.map(heroName => makeHero({ name: heroName, db })),
    villains: (args, { db }) => villains.map(villainName => makeVillain({ name: villainName, db })),
  };
};

const moviesResolver = async ({ name, castMemberName } = {}, { db }) => {
  const movies = await db.fetchMovies(name, castMemberName);
  return movies.map(movieResolver);
};

const randomMovieResolver = async (args, { db }) => {
  const movies = await db.fetchMovies();
  return movieResolver(getRandom(movies));
};

export const movieRoot = {
  movies: moviesResolver,
  randomMovie: randomMovieResolver,
};
