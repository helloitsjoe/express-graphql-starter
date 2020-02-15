import { buildSchema, GraphQLSchema, GraphQLObjectType } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { mergeTypes } from 'merge-graphql-schemas';

import { heroSchema, heroRoot } from './express-graphql/heroes';
import { movieSchema, movieRoot } from './express-graphql/movies';
import { villainSchema, villainRoot } from './express-graphql/villains';
import { planetSchema, planetRoot } from './express-graphql/planets';

import { heroFields } from './graphql/heroes';
import { villainFields } from './graphql/villains';
import { movieFields } from './graphql/movies';
import { planetFields, planetMutationFields } from './graphql/planets';

const USE_GRAPHQL_TOOLS = true;

// const expressSchemas = buildSchema(
//   mergeTypes([heroSchema, villainSchema, movieSchema, planetSchema], {
//     all: true,
//   })
// );

const stringSchema = makeExecutableSchema({
  typeDefs: [
    `
  schema {
    query: Query
    mutation: Mutation
  }
  `,
    ...heroSchema,
  ],
  resolvers: {},
});

// TODO: Maybe use a switch? See s wapi-demo
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

export const schema = USE_GRAPHQL_TOOLS ? stringSchema : objectSchema;

// export const rootValue = USE_GRAPHQL_TOOLS
//   ? { ...heroRoot, ...villainRoot, ...movieRoot, ...planetRoot }
//   : null;
