const { graphql, buildSchema } = require('graphql');
const { mergeTypes } = require('merge-graphql-schemas');
const { heroSchema } = require('../heroes');
const { movieSchema, movieRoot: rootValue } = require('../movies');
const { villainSchema } = require('../villains');
const { logGraphqlErrors } = require('../../test-utils');

// Need to merge schemas in this test because movie types refer to Hero/Villain types
const schema = buildSchema(
  mergeTypes([heroSchema, villainSchema, movieSchema], {
    all: true,
  })
);

test('by name', async () => {
  const source = `
    query {
      movies(name: "batman") {
        name
      }
    }
  `;
  const res = await graphql({ schema, source, rootValue }).then(logGraphqlErrors);
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

test('connects to villains', async () => {
  const source = `
    query {
      movies(castMemberName: "joker") {
        name
        villains {
          name
          movies {
            name
          }
        }
      }
    }
  `;
  const res = await graphql({ schema, source, rootValue }).then(logGraphqlErrors);
  const [movie] = res.data.movies;
  expect(movie.name).toBe('Batman');
  const joker = movie.villains.find(v => v.name === 'The Joker');
  expect(joker.movies.length).toBeGreaterThan(0);
});

test('connects to heroes', async () => {
  const source = `
    query {
      movies(castMemberName: "magneto") {
        name
        heroes {
          name
          movies {
            name
          }
        }
      }
    }
  `;
  const res = await graphql({ schema, source, rootValue });
  const [movie] = res.data.movies;
  expect(movie.name).toBe('X-Men');
  const wolverine = movie.heroes.find(h => h.name === 'Wolverine');
  expect(wolverine.movies.length).toBeGreaterThan(0);
});
