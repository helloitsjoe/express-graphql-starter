import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList } from 'graphql';
import data from '../data';
import { MovieType, makeMovie } from './movies';
import { HeroType } from './heroes';
import { Villain } from '../models';
import { getRandom, matchName } from '../../utils';

export const VillainType = new GraphQLObjectType({
  name: 'Villain',
  description: 'A villain',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: "The villain's name",
      args: { shouldUpperCase: { type: GraphQLBoolean } },
      resolve({ name }, { shouldUpperCase }) {
        return shouldUpperCase ? name.toUpperCase() : name;
      },
    },
    powers: { type: new GraphQLList(GraphQLString), description: "The villain's powers" },
    movies: { type: new GraphQLList(MovieType), description: 'Movies featuring the villain' },
  }),
});

export const villainFields = {
  villains: {
    type: new GraphQLList(VillainType),
    description: 'Villains filtered by name or powers',
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
    description: 'A random villain',
    resolve() {
      return getRandom(data.villains);
    },
  },
};
