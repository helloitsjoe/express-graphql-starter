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

export const movieRoot = {
  Query: {
    movies: (_, args = {}, { db }) => db.fetchMovies(args.name, args.castMemberName),
    randomMovie: (_, args, { db }) => db.fetchMovies().then(getRandom),
  },
  Movie: {
    heroes: (movie, args, { db }) => movie.heroes.map(name => makeHero({ name, db })),
    villains: (movie, args, { db }) => movie.villains.map(name => makeVillain({ name, db })),
  },
};
