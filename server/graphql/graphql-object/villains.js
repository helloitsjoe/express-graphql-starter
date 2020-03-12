/* eslint-disable import/no-cycle */
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLInt,
} from 'graphql';
import { MovieType } from './movies';
import { makeMovie } from '../models';
import { getRandom } from '../../utils';

export const VillainType = new GraphQLObjectType({
  name: 'Villain',
  description: 'A villain',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The villain's name",
      args: { shouldUpperCase: { type: GraphQLBoolean } },
      resolve({ name }, { shouldUpperCase }) {
        return shouldUpperCase ? name.toUpperCase() : name;
      },
    },
    powers: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))),
      description: "The villain's powers",
    },
    movies: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MovieType))),
      description: 'Movies featuring the villain',
      resolve(villain, args, { db }) {
        return villain.movies.map(title => makeMovie({ title, db }));
      },
    },
  }),
});

export const villainFields = {
  villain: {
    type: new GraphQLNonNull(VillainType),
    description: 'Get villain by name',
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(_, { name }, { db }) {
      return db.villain.fetchByName(name);
    },
  },
  villains: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(VillainType))),
    description: 'Get villains by ids',
    args: {
      ids: { type: new GraphQLList(GraphQLInt) },
    },
    async resolve(obj, { ids }, { db }) {
      return db.villain.fetchByIds(ids);
    },
  },
  allVillains: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(VillainType))),
    description: 'All villains, optionally filtered by power',
    args: {
      power: { type: GraphQLString },
    },
    async resolve(obj, { power }, { db }) {
      return db.villain.fetchAll(power);
    },
  },
  randomVillain: {
    type: new GraphQLNonNull(VillainType),
    description: 'A random villain',
    async resolve(_, __, { db }) {
      const villains = await db.villain.fetchAll();
      return getRandom(villains);
    },
  },
};
