const { graphql } = require('graphql');
const { schema, rootValue } = require('../rootSchemas');
const { logGraphqlErrors } = require('../../utils');

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
        heroes {
          name
        }
      }
    }
  `;
  const res = await graphql({ schema, source, rootValue, contextValue });
  const { randomMovie } = res.data;
  expect(typeof randomMovie.name).toBe('string');
  expect(randomMovie.heroes.every(h => typeof h.name === 'string')).toBe(true);
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
  expect(joker.movies.find(m => m.name === 'Batman')).toBeTruthy();
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
  expect(wolverine.movies.find(m => m.name === 'X-Men')).toBeTruthy();
});
