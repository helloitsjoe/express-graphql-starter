import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean } from 'graphql';
import data from '../data';
import { MovieType, makeMovie } from './movies';
import { makeHero } from '../models';
import { getRandom, matchName } from '../../utils';

export const HeroType = new GraphQLObjectType({
  name: 'Hero',
  description: 'A hero',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: "Hero's name",
      args: { shouldUppercase: { type: GraphQLBoolean } },
      resolve({ name }, { shouldUppercase }) {
        return shouldUppercase ? name.toUpperCase() : name;
      },
    },
    powers: { type: new GraphQLList(GraphQLString), description: "Hero's powers" },
    movies: { type: new GraphQLList(MovieType), description: 'Movies starring the hero' },
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
    description: 'A random hero',
    resolve() {
      return getRandom(data.heroes);
    },
  },
};
