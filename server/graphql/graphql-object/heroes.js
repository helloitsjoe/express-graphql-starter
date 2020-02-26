/* eslint-disable import/no-cycle */
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull,
} from 'graphql';
import { MovieType } from './movies';
import { makeMovie } from '../models';
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
        return hero.movies.map(title => makeMovie({ title, db }));
      },
    },
  }),
});

export const heroFields = {
  heroes: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(HeroType))),
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
    type: new GraphQLNonNull(HeroType),
    description: 'A random hero',
    async resolve(_, __, { db }) {
      const heroes = await db.fetchHeroes();
      return getRandom(heroes);
    },
  },
};
