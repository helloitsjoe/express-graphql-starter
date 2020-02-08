import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean } from 'graphql';
import data from '../data';
import { MovieType, makeMovie } from './movies';
import { makeHero } from '../models';
import { getRandom, matchName } from '../../utils';

export const HeroType = new GraphQLObjectType({
  name: 'Hero',
  fields: () => ({
    name: {
      type: GraphQLString,
      args: { shouldUppercase: { type: GraphQLBoolean } },
      resolve({ name }, { shouldUppercase }) {
        return shouldUppercase ? name.toUpperCase() : name;
      },
    },
    powers: { type: new GraphQLList(GraphQLString) },
    movies: { type: new GraphQLList(MovieType) },
  }),
});

export const heroFields = {
  heroes: {
    type: new GraphQLList(HeroType),
    args: {
      name: { type: GraphQLString },
      power: { type: new GraphQLList(GraphQLString) },
    },
    resolve(obj, { name, power }) {
      // Naive implementation
      const heroes = data.heroes
        .filter(h => !name || matchName(h, name))
        .filter(h => !power || h.powers.includes(power))
        .map(makeHero);

      return heroes;
    },
  },
  randomHero: {
    type: HeroType,
    resolve() {
      return getRandom(data.heroes);
    },
  },
};
