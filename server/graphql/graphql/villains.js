import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList } from 'graphql';
import data from '../data';
import { MovieType, makeMovie } from './movies';
import { HeroType } from './heroes';
import { Villain } from '../models';
import { getRandom, matchName } from '../../utils';

export const VillainType = new GraphQLObjectType({
  name: 'Villain',
  fields: () => ({
    name: {
      type: GraphQLString,
      args: { shouldUpperCase: { type: GraphQLBoolean } },
      resolve({ name }, { shouldUpperCase }) {
        return shouldUpperCase ? name.toUpperCase() : name;
      },
    },
    powers: { type: new GraphQLList(GraphQLString) },
    movies: { type: new GraphQLList(MovieType) },
  }),
});

export const villainFields = {
  villains: {
    type: new GraphQLList(VillainType),
    args: {
      name: { type: GraphQLString },
      power: { type: GraphQLString },
    },
    resolve(obj, { name, power }) {
      // Naive implementation
      const villains = data.villains
        .filter(v => !name || matchName(v, name))
        .filter(v => !power || v.powers.includes(power))
        .map(v => new Villain(v));

      return villains;
    },
  },
  randomVillain: {
    type: VillainType,
    resolve() {
      return getRandom(data.villains);
    },
  },
};
