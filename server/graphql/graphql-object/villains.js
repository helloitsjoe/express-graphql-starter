/* eslint-disable import/no-cycle */
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
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
  villains: {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(VillainType))),
    description: 'Villains filtered by name or powers',
    args: {
      name: { type: GraphQLString },
      power: { type: GraphQLString },
    },
    async resolve(obj, { name, power }, { db }) {
      return db.fetchVillains(name, power);
      // return villains.map(v => new Villain().init({ name: v.name, db }));
    },
  },
  randomVillain: {
    type: new GraphQLNonNull(VillainType),
    description: 'A random villain',
    async resolve(_, __, { db }) {
      const villains = await db.fetchVillains();
      return getRandom(villains);
    },
  },
};
