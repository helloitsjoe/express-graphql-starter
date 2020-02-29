/* eslint-disable import/no-cycle */
import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { VillainType } from './villains';
import { HeroType } from './heroes';
import { makeHero, makeVillain } from '../models';
import { getRandom } from '../../utils';

export const MovieType = new GraphQLObjectType({
  name: 'Movie',
  description: 'A Movie',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString), description: "The movie's title" },
    heroes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(HeroType))),
      description: 'Heroes in the movie',
      async resolve(movie, args, { db }) {
        return movie.heroes.map(name => makeHero({ name, db }));
      },
    },
    villains: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(VillainType))),
      description: 'Villains in the movie',
      async resolve(movie, args, { db }) {
        return movie.villains.map(name => makeVillain({ name, db }));
      },
    },
  }),
});

export const movieFields = {
  movies: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MovieType))),
    description: 'Movies filtered by titles or castMemberName',
    args: {
      titles: { type: new GraphQLList(GraphQLString) },
      castMemberName: { type: GraphQLString },
    },
    async resolve(_, { titles, castMemberName }, { db }) {
      return db.fetchMovies(titles, castMemberName);

      // const movies = await db.fetchMovies(title, castMemberName);
      // return movies.map(m => makeMovie({ title: m.title, db }));
    },
  },
  randomMovie: {
    type: new GraphQLNonNull(MovieType),
    description: 'A random movie',
    async resolve(_, __, { db }) {
      const movies = await db.fetchMovies();
      return getRandom(movies);
      // return makeMovie({ title: getRandom(movies).title, db });
    },
  },
};
