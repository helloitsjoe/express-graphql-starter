import { graphql } from 'graphql';
import { schema } from '../rootSchemas';
import { logGraphqlErrors } from '../../utils';
import { makeDB, makeLoaders } from '../db';

const contextValue = { db: { ...makeDB(), ...makeLoaders() } };

test('get hero by name', async () => {
  const source = `
    query {
      heroes(name: "indiana jones") {
        name
        powers
        movies {
          name
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
  const raiders = indy.movies.find(m => m.name.match(/raiders/i));
  expect(raiders.heroes.some(h => h.name.match(/indiana jones/i))).toBe(true);
});

test('uppercase name', async () => {
  const source = `
    query {
      heroes(name: "indiana jones") {
        name(shouldUppercase: true)
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
          name
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
