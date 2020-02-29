import { graphql } from 'graphql';
import { schema } from '../rootSchemas';
import { logGraphqlErrors } from '../../utils';
import { withLoaders, makeAPI } from '../db';

const contextValue = { db: withLoaders(makeAPI()) };

test('by name', async () => {
  const source = `
    query {
      movies(titles: ["batman"]) {
        title
        heroes {
          name
        }
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue }).then(logGraphqlErrors);
  expect(res.data.movies.length).toBe(1);
  const [batman] = res.data.movies;
  expect(batman.title).toBe('Batman');
  expect(batman.heroes[0].name).toBe('Batman');
});

test('multiple movies by name', async () => {
  const source = `
    query {
      movies(titles: ["batman", "temple of doom"]) {
        title
        heroes {
          name
        }
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue }).then(logGraphqlErrors);
  expect(res.data.movies.length).toBe(2);
  const [batman, temple] = res.data.movies;

  expect(batman.title).toBe('Batman');
  expect(batman.heroes[0].name).toBe('Batman');

  expect(temple.title).toBe('Temple of Doom');
  expect(temple.heroes[0].name).toBe('Indiana Jones');
});

test('by cast member name', async () => {
  const source = `
    query {
      movies(castMemberName: "joker") {
        title
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue });
  expect(res.data.movies[0].title).toBe('Batman');
});

test('random movie', async () => {
  const source = `
    query {
      randomMovie {
        title
        heroes {
          name
        }
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue }).then(logGraphqlErrors);
  const { randomMovie } = res.data;
  expect(typeof randomMovie.title).toBe('string');
  expect(randomMovie.heroes.every(h => typeof h.name === 'string')).toBe(true);
});

test('connects to villains', async () => {
  const source = `
    query {
      movies(castMemberName: "joker") {
        title
        villains {
          name
          movies {
            title
          }
        }
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue }).then(logGraphqlErrors);
  const [movie] = res.data.movies;
  expect(movie.title).toBe('Batman');
  const joker = movie.villains.find(v => v.name === 'The Joker');
  expect(joker.movies.find(m => m.title === 'Batman')).toBeTruthy();
});

test('connects to heroes', async () => {
  const source = `
    query {
      movies(castMemberName: "magneto") {
        title
        heroes {
          name
          movies {
            title
          }
        }
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue });
  const [movie] = res.data.movies;
  expect(movie.title).toBe('X-Men');
  const wolverine = movie.heroes.find(h => h.name === 'Wolverine');
  expect(wolverine.movies.find(m => m.title === 'X-Men')).toBeTruthy();
});
