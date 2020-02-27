import { graphql } from 'graphql';
import { schema } from '../rootSchemas';
import { logGraphqlErrors } from '../../utils';
import { withLoaders, makeAPI } from '../db';

const contextValue = { db: withLoaders(makeAPI()) };

test('get hero by name', async () => {
  const source = `
    query {
      heroes(names: ["indiana jones"]) {
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
  const [indy] = res.data.heroes;
  expect(indy.name).toBe('Indiana Jones');
  expect(indy.powers).toEqual(['whip', 'intelligence']);
  const raiders = indy.movies.find(m => m.title.match(/raiders/i));
  expect(raiders.heroes.some(h => h.name.match(/indiana jones/i))).toBe(true);
});

test('get multiple heroes by name', async () => {
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

test('get hero by power', async () => {
  const source = `
    query {
      heroes(power: "strength") {
        name
        powers
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue });
  expect(res.data.heroes.every(h => h.powers.includes('strength'))).toBe(true);
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
