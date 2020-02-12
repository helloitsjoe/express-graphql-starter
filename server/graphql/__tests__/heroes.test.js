const { graphql } = require('graphql');
const { schema, rootValue } = require('../rootSchemas');
const { logGraphqlErrors } = require('../../utils');
const data = require('../data');

const contextValue = { data };

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
  const res = await graphql({ schema, source, rootValue, contextValue }).then(logGraphqlErrors);
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
  const res = await graphql({ schema, source, rootValue, contextValue });
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
  const res = await graphql({ schema, source, rootValue, contextValue });
  expect(res.data.heroes.every(h => h.powers.includes('strength'))).toBe(true);
});

test('get random hero', async () => {
  const source = `
    query {
      randomHero {
        name
        movies {
          name
        }
      }
    }
  `;
  const res = await graphql({ schema, source, rootValue, contextValue }).then(logGraphqlErrors);
  expect(typeof res.data.randomHero.name).toBe('string');
});
