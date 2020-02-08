import { buildSchema, GraphQLSchema, GraphQLObjectType } from 'graphql';
import { mergeTypes } from 'merge-graphql-schemas';

import { heroSchema, heroRoot } from './express-graphql/heroes';
import { movieSchema, movieRoot } from './express-graphql/movies';
import { villainSchema, villainRoot } from './express-graphql/villains';
import { planetSchema, planetRoot } from './express-graphql/planets';

import { heroFields } from './graphql/heroes';
import { villainFields } from './graphql/villains';
import { movieFields } from './graphql/movies';
import { planetFields } from './graphql/planets';

const USE_EXPRESS = false;

const expressSchemas = buildSchema(
  mergeTypes([heroSchema, villainSchema, movieSchema, planetSchema], {
    all: true,
  })
);

const combinedSchemas = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
      ...heroFields,
      ...villainFields,
      ...movieFields,
      ...planetFields,
    }),
  }),
});

export const schema = USE_EXPRESS ? expressSchemas : combinedSchemas;

export const rootValue = USE_EXPRESS
  ? { ...heroRoot, ...villainRoot, ...movieRoot, ...planetRoot }
  : null;
