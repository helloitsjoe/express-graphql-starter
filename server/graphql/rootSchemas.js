import { buildSchema, GraphQLSchema, GraphQLObjectType } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { mergeTypes } from 'merge-graphql-schemas';
import merge from 'lodash/merge';

import { heroSchema, heroRoot } from './executable-schema/heroes';
import { movieSchema, movieRoot } from './executable-schema/movies';
import { villainSchema, villainRoot } from './executable-schema/villains';
import { planetSchema, planetRoot } from './executable-schema/planets';

import { heroFields } from './graphql-object/heroes';
import { movieFields } from './graphql-object/movies';
import { villainFields } from './graphql-object/villains';
import { planetFields, planetMutationFields } from './graphql-object/planets';

const USE_EXECUTABLE_SCHEMA = true;

const Query = `
  type Query
`;
const Mutation = `
  type Mutation
`;

const stringSchema = makeExecutableSchema({
  typeDefs: [Query, Mutation, villainSchema, heroSchema, movieSchema, planetSchema],
  resolvers: merge(heroRoot, villainRoot, movieRoot, planetRoot),
});

// TODO: Maybe use a switch? See swapi-demo
const objectSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
      ...heroFields,
      ...villainFields,
      ...movieFields,
      ...planetFields,
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: () => ({
      ...planetMutationFields,
    }),
  }),
});

export const schema = USE_EXECUTABLE_SCHEMA ? stringSchema : objectSchema;

export const rootValue = null;
// export const rootValue = USE_GRAPHQL_TOOLS
//   ? { ...heroRoot, ...villainRoot, ...movieRoot, ...planetRoot }
//   : null;
