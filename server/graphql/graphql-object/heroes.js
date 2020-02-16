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
      async resolve(hero, args, { data }) {
        return hero.movies.map(name => makeMovie({ name, data }));
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
    async resolve(_, { name, power }, { data }) {
      // TODO: Would it be better to return a model?
      return data.fetchHeroes(name, power);
      // return heroes.map(h => makeHero({ name: h.name, data }));
    },
  },
  randomHero: {
    type: HeroType,
    description: 'A random hero',
    async resolve(_, __, { data }) {
      const heroes = await data.fetchHeroes();
      return getRandom(heroes);
    },
  },
};
