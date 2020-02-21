/* eslint-disable import/no-cycle */
import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { VillainType } from './villains';
import { HeroType } from './heroes';
import { makeHero, makeVillain } from '../models';
import { getRandom } from '../../utils';

export const MovieType = new GraphQLObjectType({
  name: 'Movie',
  description: 'A Movie',
  fields: () => ({
    name: { type: GraphQLString, description: "The movie's name" },
    heroes: {
      type: new GraphQLList(HeroType),
      description: 'Heroes in the movie',
      async resolve(movie, args, { db }) {
        return movie.heroes.map(heroName => makeHero({ name: heroName, db }));
      },
    },
    villains: {
      type: new GraphQLList(VillainType),
      description: 'Villains in the movie',
      async resolve(movie, args, { db }) {
        return movie.villains.map(villainName => makeVillain({ name: villainName, db }));
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
    async resolve(_, { name, castMemberName }, { db }) {
      // TODO: Would it be better to return a model?
      return db.fetchMovies(name, castMemberName);
      // const movies = await db.fetchMovies(name, castMemberName);
      // return movies.map(m => makeMovie({ name: m.name, db }));
    },
  },
  randomMovie: {
    type: MovieType,
    description: 'A random movie',
    async resolve(_, __, { db }) {
      const movies = await db.fetchMovies();
      return getRandom(movies);
      // return makeMovie({ name: getRandom(movies).name, db });
    },
  },
};
