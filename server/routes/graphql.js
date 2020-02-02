const express = require('express');
const gqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const { mergeTypes } = require('merge-graphql-schemas');
const { heroSchema, heroRootObject: hero } = require('../graphql/heroes');
const { movieSchema, movieRoot: movie } = require('../graphql/movies');
const { villainSchema, villainRoot: villain } = require('../graphql/villains');
const { planetSchema, planetRoot } = require('../graphql/planets');

// TODO: Maybe call buildSchema in each file?
const combinedSchemas = buildSchema(
  mergeTypes([heroSchema, villainSchema, movieSchema, planetSchema], {
    all: true,
  })
);

const gql = gqlHTTP(request => ({
  schema: combinedSchemas,
  rootValue: { ...hero, ...villain, ...movie, ...planetRoot },
  graphiql: true,
  context: { request },
}));

const router = express.Router();

router.post('/', gql);
router.get('/', gql);

module.exports = router;
