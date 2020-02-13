/* eslint-disable import/no-cycle */
import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { VillainType } from './villains';
import { HeroType } from './heroes';
import { makeMovie, makeHero, Villain } from '../models';
import { getRandom } from '../../utils';

export const MovieType = new GraphQLObjectType({
  name: 'Movie',
  description: 'A Movie',
  fields: () => ({
    name: { type: GraphQLString, description: "The movie's name" },
    heroes: {
      type: new GraphQLList(HeroType),
      description: 'Heroes in the movie',
      async resolve(movie, args, { data }) {
        return movie.heroes.map(heroName => makeHero({ name: heroName, data }));
      },
    },
    villains: {
      type: new GraphQLList(VillainType),
      description: 'Villains in the movie',
      async resolve(movie, args, { data }) {
        return movie.villains.map(villainName => new Villain().init({ name: villainName, data }));
      },
    },
  }),
});

export const movieFields = {
  movies: {
    type: new GraphQLList(MovieType),
    description: 'Movies filtered by name or castMemberName',
    args: {
      name: { type: GraphQLString },
      castMemberName: { type: GraphQLString },
    },
    async resolve(_, { name, castMemberName }, { data }) {
      // TODO: Would it be better to return a model?
      return data.fetchMovies(name, castMemberName);
      // const movies = await data.fetchMovies(name, castMemberName);
      // return movies.map(m => makeMovie({ name: m.name, data }));
    },
  },
  randomMovie: {
    type: MovieType,
    description: 'A random movie',
    async resolve(_, __, { data }) {
      const movies = await data.fetchMovies();
      return getRandom(movies);
      // return makeMovie({ name: getRandom(movies).name, data });
    },
  },
};
