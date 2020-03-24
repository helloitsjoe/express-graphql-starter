/* eslint-disable import/no-cycle */
import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLInt } from 'graphql';
import { VillainType } from './villains';
import { HeroType } from './heroes';
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
        return movie.heroes.map(name => db.hero.nameLoader.load(name));
      },
    },
    villains: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(VillainType))),
      description: 'Villains in the movie',
      async resolve(movie, args, { db }) {
        return movie.villains.map(name => db.villain.nameLoader.load(name));
      },
    },
  }),
});

export const movieFields = {
  movie: {
    type: new GraphQLNonNull(MovieType),
    description: 'Get a movie by title',
    args: {
      title: { type: GraphQLString },
    },
    async resolve(_, { title }, { db }) {
      return db.movie.fetchByTitle(title);
    },
  },
  movies: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MovieType))),
    description: 'Get a list of movies by ids',
    args: {
      ids: { type: new GraphQLList(GraphQLInt) },
    },
    async resolve(_, { ids }, { db }) {
      return db.movie.fetchByIds(ids);
    },
  },
  allMovies: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MovieType))),
    description: 'All movies, optionally filtered by castMemberName',
    args: {
      titles: { type: new GraphQLList(GraphQLString) },
      castMemberName: { type: GraphQLString },
    },
    async resolve(_, { castMemberName }, { db }) {
      return db.movie.fetchAll(castMemberName);
    },
  },
  randomMovie: {
    type: new GraphQLNonNull(MovieType),
    description: 'A random movie',
    async resolve(_, __, { db }) {
      const movies = await db.movie.fetchAll();
      return getRandom(movies);
      // return makeMovie({ title: getRandom(movies).title, db });
    },
  },
};
