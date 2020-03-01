import { graphql } from 'graphql';
import { schema } from '../rootSchemas';
import { logGraphqlErrors } from '../../utils';
import { makeAPI } from '../db';

const contextValue = { db: makeAPI() };

test('get heroes by name', async () => {
  const source = `
    query {
      heroes(names: ["indiana jones", "Batman"]) {
        name
        powers
        movies {
          title
          heroes {
            name
          }
        }
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue }).then(logGraphqlErrors);
  const [indy, batman] = res.data.heroes;
  expect(indy.name).toBe('Indiana Jones');
  expect(indy.powers).toEqual(['whip', 'intelligence']);
  const raiders = indy.movies.find(m => m.title.match(/raiders/i));
  expect(raiders.heroes.some(h => h.name.match(/indiana jones/i))).toBe(true);

  expect(batman.name).toBe('Batman');
  expect(batman.powers).toEqual(['technology']);
  const movie = batman.movies.find(m => m.title.match(/batman/i));
  expect(movie.heroes.some(h => h.name.match(/batman/i))).toBe(true);
});

test('uppercase name', async () => {
  const source = `
    query {
      heroes(names: ["indiana jones"]) {
        name(shouldUpperCase: true)
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue }).then(logGraphqlErrors);
  const [indy] = res.data.heroes;
  expect(indy.name).toBe('INDIANA JONES');
});

test('get all heroes', async () => {
  const source = `
    query {
      allHeroes {
        name
        powers
        movies {
          title
          heroes {
            name
          }
          villains {
            name
          }
        }
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue }).then(logGraphqlErrors);
  const { allHeroes } = res.data;
  expect(allHeroes.length).toBe(8);
  expect(allHeroes.every(h => h.powers.length > 0)).toBe(true);
  expect(allHeroes.every(h => h.movies.length > 0)).toBe(true);
  expect(allHeroes.every(h => h.movies.every(m => m.heroes.length > 0))).toBe(true);
  expect(allHeroes.every(h => h.movies.every(m => m.villains.length > 0))).toBe(true);
});

test('get hero by power', async () => {
  const source = `
    query {
      allHeroes(power: "strength") {
        name
        powers
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue }).then(logGraphqlErrors);
  expect(res.data.allHeroes.every(h => h.powers.includes('strength'))).toBe(true);
});

test('get random hero', async () => {
  const source = `
    query {
      randomHero {
        name
        movies {
          title
          heroes {
            name
          }
        }
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue }).then(logGraphqlErrors);
  const { randomHero } = res.data;
  expect(typeof randomHero.name).toBe('string');
  const [firstMovie] = randomHero.movies;
  expect(firstMovie.heroes.some(h => h.name === randomHero.name)).toBe(true);
});
