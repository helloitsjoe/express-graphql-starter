import data from '../data';
import { Villain } from './villains';
import { makeHero } from './heroes';
import { matchName, getRandom } from '../../utils';

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

const getCastMembers = movie => movie.heroes.concat(movie.villains);

export const makeMovie = ({ name }) => {
  const movie = data.movies.find(m => matchName(m, name));
  return {
    name: () => movie.name,
    heroes: () => movie.heroes.map(makeHero),
    villains: () => movie.villains.map(v => new Villain(v)),
  };
};

export class Query {
  movies = ({ name, castMemberName } = {}) => {
    const movies = data.movies
      .filter(m => !name || matchName(m, name))
      .filter(m => !castMemberName || getCastMembers(m).some(c => matchName(c, castMemberName)))
      .map(makeMovie);

    return movies;
  };

  randomMovie = () => {
    return getRandom(data.movies);
  };
}

export const movieRoot = new Query();
