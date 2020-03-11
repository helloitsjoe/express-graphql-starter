import { makeHero, makeVillain } from '../models';
import { getRandom } from '../../utils';

// Note that we can use types defined in other files
export const movieSchema = `
  type Movie {
    "Movie title"
    title: String!
    "Heroes in movie"
    heroes: [Hero!]!
    "Villains in movie"
    villains: [Villain!]!
  }

  extend type Query {
    "Find movie by title"
    movie(title: String!): Movie!
    "Find movies by an array of ids"
    movies(ids: [Int]): [Movie!]!
    "All movies optionally filtered by castMemberName"
    allMovies(castMemberName: String): [Movie!]!
    "Get a random movie"
    randomMovie: Movie!
  }
`;

export const movieRoot = {
  Query: {
    movie: (_, { title }, { db }) => db.movie.fetchByTitle(title),
    movies: (_, { ids }, { db }) => db.movie.fetchByIds(ids),
    allMovies: (_, { castMemberName }, { db }) => db.movie.fetchAll(castMemberName),
    randomMovie: (_, args, { db }) => db.movie.fetchAll().then(getRandom),
  },
  Movie: {
    heroes: (movie, args, { db }) => movie.heroes.map(name => makeHero({ name, db })),
    villains: (movie, args, { db }) => movie.villains.map(name => makeVillain({ name, db })),
  },
};
