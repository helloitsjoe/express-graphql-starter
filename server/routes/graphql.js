const express = require('express');
const gqlHTTP = require('express-graphql');
const { buildSchema, GraphQLSchema, GraphQLObjectType } = require('graphql');
const { mergeTypes } = require('merge-graphql-schemas');

const { heroSchema, heroRootObject: hero } = require('../graphql/express-graphql/heroes');
const { movieSchema, movieRoot: movie } = require('../graphql/express-graphql/movies');
const { villainSchema, villainRoot: villain } = require('../graphql/express-graphql/villains');
const { planetSchema, planetRoot } = require('../graphql/express-graphql/planets');

const { heroFields } = require('../graphql/graphql/heroes');
const { villainFields } = require('../graphql/graphql/villains');
const { movieFields } = require('../graphql/graphql/movies');
const { planetFields } = require('../graphql/graphql/planets');

// const combinedSchemas = buildSchema(
//   mergeTypes([heroSchema, villainSchema, movieSchema, planetSchema], {
//     all: true,
//   })
// );

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

const gql = gqlHTTP(request => ({
  schema: combinedSchemas,
  // rootValue: { ...hero, ...villain, ...movie, ...planetRoot },
  graphiql: true,
  context: { request },
}));

const router = express.Router();

router.post('/', gql);
router.get('/', gql);

module.exports = router;
