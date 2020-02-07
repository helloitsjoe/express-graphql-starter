const express = require('express');
const gqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const { mergeTypes } = require('merge-graphql-schemas');

const { heroSchema, heroRootObject: hero } = require('../graphql/express-graphql/heroes');
const { movieSchema, movieRoot: movie } = require('../graphql/express-graphql/movies');
const { villainSchema, villainRoot: villain } = require('../graphql/express-graphql/villains');
const { planetSchema, planetRoot } = require('../graphql/express-graphql/planets');

// const { HeroQuery } = require('../graphql/graphql/heroes');
// const { VillainQuery } = require('../graphql/graphql/villains');
// const { MovieQuery } = require('../graphql/graphql/movies');

// TODO: Maybe call buildSchema in each file?
const combinedSchemas = buildSchema(
  mergeTypes([heroSchema, villainSchema, movieSchema, planetSchema], {
    all: true,
  })
);

// const combinedSchemas = mergeTypes([HeroQuery, VillainQuery, MovieQuery]);
// console.log(`combinedSchemas:`, combinedSchemas);

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
