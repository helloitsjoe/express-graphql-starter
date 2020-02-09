import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import data from '../data';
import { VillainType } from './villains';
import { HeroType } from './heroes';
import { makeMovie } from '../models';
import { getRandom, matchName } from '../../utils';

const getCastMembers = movie => movie.heroes.concat(movie.villains);

export const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    name: { type: GraphQLString },
    heroes: { type: new GraphQLList(HeroType) },
    villains: { type: new GraphQLList(VillainType) },
  }),
});

export const movieFields = {
  movies: {
    type: new GraphQLList(MovieType),
    args: {
      name: { type: GraphQLString },
      castMemberName: { type: GraphQLString },
    },
    resolve(_, { name, castMemberName }) {
      // Naive implementation
      const movies = data.movies
        .filter(m => !name || matchName(m, name))
        .filter(m => !castMemberName || getCastMembers(m).some(c => matchName(c, castMemberName)))
        .map(makeMovie);

      return movies;
    },
  },
  randomMovie: {
    type: MovieType,
    resolve() {
      return makeMovie(getRandom(data.movies));
    },
  },
};