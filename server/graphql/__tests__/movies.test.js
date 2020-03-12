import { graphql } from 'graphql';
import { schema } from '../rootSchemas';
import { logGraphqlErrors } from '../../utils';
import { makeAPI } from '../db';

// makeAPI automatically populates hero, villain, and movie DBs
// and also allows for them to be passed in. Right now the default
// data is mock data, but if the default were to use a real DB,
// we could inject mock data here.
const contextValue = { db: makeAPI() };

test('by title', async () => {
  const source = `
    query {
      movie(title: "batman") {
        title
        heroes {
          name
        }
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue }).then(logGraphqlErrors);
  const batman = res.data.movie;
  expect(batman.title).toBe('Batman');
  expect(batman.heroes[0].name).toBe('Batman');
});

test('multiple movies by id', async () => {
  const source = `
    query {
      movies(ids: [15, 16]) {
        title
        heroes {
          name
        }
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue }).then(logGraphqlErrors);
  expect(res.data.movies.length).toBe(2);
  const [raiders, temple] = res.data.movies;

  expect(raiders.title).toBe('Raiders of the Lost Ark');
  expect(raiders.heroes[0].name).toBe('Indiana Jones');

  expect(temple.title).toBe('Temple of Doom');
  expect(temple.heroes[0].name).toBe('Indiana Jones');
});

test('by cast member name', async () => {
  const source = `
    query {
      allMovies(castMemberName: "joker") {
        title
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue }).then(logGraphqlErrors);
  expect(res.data.allMovies[0].title).toBe('Batman');
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
      allMovies(castMemberName: "joker") {
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
  const [movie] = res.data.allMovies;
  expect(movie.title).toBe('Batman');
  const joker = movie.villains.find(v => v.name === 'The Joker');
  expect(joker.movies.find(m => m.title === 'Batman')).toBeTruthy();
});

test('connects to heroes', async () => {
  const source = `
    query {
      allMovies(castMemberName: "magneto") {
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
  const [movie] = res.data.allMovies;
  expect(movie.title).toBe('X-Men');
  const wolverine = movie.heroes.find(h => h.name === 'Wolverine');
  expect(wolverine.movies.find(m => m.title === 'X-Men')).toBeTruthy();
});
