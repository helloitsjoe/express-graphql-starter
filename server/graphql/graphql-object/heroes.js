/* eslint-disable import/no-cycle */
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';
import { MovieType } from './movies';
import { getRandom } from '../../utils';

export const HeroType = new GraphQLObjectType({
  name: 'Hero',
  description: 'A hero',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: "Hero's name",
      args: { shouldUpperCase: { type: GraphQLBoolean } },
      async resolve({ name }, { shouldUpperCase }) {
        return shouldUpperCase ? name.toUpperCase() : name;
      },
    },
    powers: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
      description: "Hero's powers",
    },
    movies: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MovieType))),
      description: 'Movies starring the hero',
      async resolve(hero, args, { db }) {
        return hero.movies.map(title => db.movie.titleLoader.load(title));
      },
    },
  }),
});

export const heroFields = {
  hero: {
    type: new GraphQLNonNull(HeroType),
    description: 'Get Hero by name',
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(_, { name }, { db }) {
      return db.hero.fetchByName(name);
    },
  },
  heroes: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(HeroType))),
    description: 'Get a list of heroes by ids',
    args: {
      ids: { type: new GraphQLList(GraphQLInt) },
    },
    async resolve(_, { ids }, { db }) {
      return db.hero.fetchByIds(ids);
    },
  },
  allHeroes: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(HeroType))),
    description: 'All heroes, optionally filtered by power',
    args: {
      power: { type: new GraphQLList(GraphQLString) },
    },
    async resolve(_, { power }, { db }) {
      return db.hero.fetchAll(power);
    },
  },
  randomHero: {
    type: new GraphQLNonNull(HeroType),
    description: 'A random hero',
    async resolve(_, __, { db }) {
      const heroes = await db.hero.fetchAll();
      return getRandom(heroes);
    },
  },
};
