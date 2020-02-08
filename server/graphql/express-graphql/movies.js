import { movies } from '../data';
import { Villain } from './villains';
import { makeHero } from './heroes';
import { matchName } from '../../utils';

// Note that we can use types defined in other files
export const movieSchema = `
  type Movie {
    name: String!
    heroes: [Hero!]!
    villains: [Villain!]!
  }

  type Query {
    movies(name: String, castMemberName: String): [Movie!]!
    randomMovie: Movie!
  }
`;

const getCastMembers = movie => movie.heroes.concat(movie.villains);

export const makeMovie = ({ name }) => {
  const movie = movies.find(m => matchName(m, name));
  return {
    name: () => movie.name,
    heroes: () => movie.heroes.map(makeHero),
    villains: () => movie.villains.map(v => new Villain(v)),
  };
};

export class Query {
  movies = ({ name, castMemberName } = {}) => {
    const movieByName = name && movies.filter(m => matchName(m, name));
    const movieByCastMember =
      castMemberName &&
      movies.filter(m => getCastMembers(m).some(c => matchName(c, castMemberName)));

    const finalMovies = movieByName || movieByCastMember || movies;

    return finalMovies.map(makeMovie);
  };

  randomMovie = () => {
    return movies[Math.floor(Math.random() * movies.length)];
  };
}

export const movieRoot = new Query();
