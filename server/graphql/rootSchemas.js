/* eslint-disable import/prefer-default-export */
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import merge from 'lodash/merge';

import { heroSchema, heroRoot } from './executable-schema/heroes';
import { movieSchema, movieRoot } from './executable-schema/movies';
import { villainSchema, villainRoot } from './executable-schema/villains';
import { planetSchema, planetRoot } from './executable-schema/planets';

import { heroFields } from './graphql-object/heroes';
import { movieFields } from './graphql-object/movies';
import { villainFields } from './graphql-object/villains';
import { planetFields, planetMutationFields } from './graphql-object/planets';

const Query = `
  type Query
`;
const Mutation = `
  type Mutation
`;

const typeDefs = [Query, Mutation, villainSchema, heroSchema, movieSchema, planetSchema];
const resolvers = merge(heroRoot, villainRoot, movieRoot, planetRoot);

const stringSchema = makeExecutableSchema({ typeDefs, resolvers });

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

export const schema = process.env.OBJECT_SCHEMA ? objectSchema : stringSchema;
