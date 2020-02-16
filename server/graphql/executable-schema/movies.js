// import { VillainType } from './villains';
// import { heroResolver } from './heroes';
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

const moviesResolver = async (_, { name, castMemberName } = {}, { data }) => {
  const movies = await data.fetchMovies(name, castMemberName);
  return movies;
};

const randomMovieResolver = async (_, args, { data }) => {
  const movies = await data.fetchMovies();
  return getRandom(movies);
  // return movieResolver(getRandom(movies));
};

export const movieRoot = {
  Query: {
    movies: moviesResolver,
    randomMovie: randomMovieResolver,
  },
  Movie: {
    heroes: (movie, args, { data }) => movie.heroes.map(name => makeHero({ name, data })),
    villains: (movie, args, { data }) => movie.villains.map(name => makeVillain({ name, data })),
  },
};
