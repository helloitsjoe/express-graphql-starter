/* eslint-disable import/no-cycle */
import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean } from 'graphql';
import { MovieType } from './movies';
import { makeMovie } from '../models';
import { getRandom } from '../../utils';

export const HeroType = new GraphQLObjectType({
  name: 'Hero',
  description: 'A hero',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: "Hero's name",
      args: { shouldUppercase: { type: GraphQLBoolean } },
      async resolve({ name }, { shouldUppercase }) {
        return shouldUppercase ? name.toUpperCase() : name;
      },
    },
    powers: { type: new GraphQLList(GraphQLString), description: "Hero's powers" },
    movies: {
      type: new GraphQLList(MovieType),
      description: 'Movies starring the hero',
      async resolve(hero, args, { db }) {
        return hero.movies.map(title => makeMovie({ title, db }));
      },
    },
  }),
});

export const heroFields = {
  heroes: {
    type: new GraphQLList(HeroType),
    description: 'Heroes filtered by name or power',
    args: {
      name: { type: GraphQLString },
      power: { type: new GraphQLList(GraphQLString) },
    },
    async resolve(_, { name, power }, { db }) {
      return db.fetchHeroes(name, power);
      // return heroes.map(h => makeHero({ name: h.name, db }));
    },
  },
  randomHero: {
    type: HeroType,
    description: 'A random hero',
    async resolve(_, __, { db }) {
      const heroes = await db.fetchHeroes();
      return getRandom(heroes);
    },
  },
};
