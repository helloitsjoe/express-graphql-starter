const { graphql, buildSchema } = require('graphql');
const { mergeTypes } = require('merge-graphql-schemas');
const { heroSchema } = require('../heroes');
const { movieSchema, movieRoot: rootValue } = require('../movies');
const { villainSchema } = require('../villains');

// Need to merge schemas in this test because movie types refer to Hero/Villain types
const combinedTypes = mergeTypes([heroSchema, villainSchema, movieSchema], {
  all: true,
});
const schema = buildSchema(combinedTypes);

test('by name', async () => {
  const source = `
    query {
      movies(name: "batman") {
        name
      }
    }
  `;
  const res = await graphql({ schema, source, rootValue });
  expect(res.data.movies[0].name).toBe('Batman');
});

test('by cast member name', async () => {
  const source = `
    query {
      movies(castMemberName: "joker") {
        name
      }
    }
  `;
  const res = await graphql({ schema, source, rootValue });
  expect(res.data.movies[0].name).toBe('Batman');
});

test('random movie', async () => {
  const source = `
    query {
      randomMovie {
        name
      }
    }
  `;
  const res = await graphql({ schema, source, rootValue });
  expect(typeof res.data.randomMovie.name).toBe('string');
});
