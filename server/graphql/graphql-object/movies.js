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
    title: { type: GraphQLString, description: "The movie's title" },
    heroes: {
      type: new GraphQLList(HeroType),
      description: 'Heroes in the movie',
      async resolve(movie, args, { db }) {
        return movie.heroes.map(name => makeHero({ name, db }));
      },
    },
    villains: {
      type: new GraphQLList(VillainType),
      description: 'Villains in the movie',
      async resolve(movie, args, { db }) {
        return movie.villains.map(name => makeVillain({ name, db }));
      },
    },
  }),
});

export const movieFields = {
  movies: {
    type: new GraphQLList(MovieType),
    description: 'Movies filtered by title or castMemberName',
    args: {
      title: { type: GraphQLString },
      castMemberName: { type: GraphQLString },
    },
    async resolve(_, { title, castMemberName }, { db }) {
      return db.fetchMovies(title, castMemberName);

      // const movies = await db.fetchMovies(title, castMemberName);
      // return movies.map(m => makeMovie({ title: m.title, db }));
    },
  },
  randomMovie: {
    type: MovieType,
    description: 'A random movie',
    async resolve(_, __, { db }) {
      const movies = await db.fetchMovies();
      return getRandom(movies);
      // return makeMovie({ title: getRandom(movies).title, db });
    },
  },
};
