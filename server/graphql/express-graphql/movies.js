import { VillainType } from './villains';
import { heroResolver } from './heroes';
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

export const movieResolver = async ({ name, data }) => {
  const [movie] = await data.fetchMovies(name);
  return {
    name: () => movie.name,
    // TODO: Should this be makeHero/Villain from models.js instead?
    heroes: () => movie.heroes.map(heroResolver),
    villains: () => movie.villains.map(v => new VillainType(v)),
  };
};

const moviesResolver = async ({ name, castMemberName } = {}, { data }) => {
  const movies = await data.fetchMovies(name, castMemberName);
  return movies.map(m => movieResolver({ name: m.name, data }));
};

const randomMovieResolver = async (args, { data }) => {
  const movies = await data.fetchMovies();
  return getRandom(movies);
};

export const movieRoot = {
  movies: moviesResolver,
  randomMovie: randomMovieResolver,
};
