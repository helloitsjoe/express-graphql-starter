const { graphql, buildSchema } = require('graphql');
const { mergeTypes } = require('merge-graphql-schemas');
const { heroSchema, heroRootObject } = require('../heroes');
const { villainSchema } = require('../villains');
const { movieSchema } = require('../movies');
const { logGraphqlErrors } = require('../../test-utils');

const schema = buildSchema(mergeTypes([heroSchema, villainSchema, movieSchema]));

test('get hero by name', async () => {
  const source = `
    query {
      heroes(name: "indiana jones") {
        name
        powers
        movies {
          name
        }
      }
    }
  `;
  const res = await graphql({ schema, source, rootValue: heroRootObject }).then(logGraphqlErrors);
  const [indy] = res.data.heroes;
  expect(indy.name).toBe('Indiana Jones');
  expect(indy.powers).toEqual(['whip', 'intelligence']);
  expect(indy.movies.length).toBeGreaterThan(0);
});

test('uppercase name', async () => {
  const source = `
    query {
      heroes(name: "indiana jones") {
        name(shouldUppercase: true)
      }
    }
  `;
  const res = await graphql({ schema, source, rootValue: heroRootObject });
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
  const res = await graphql({ schema, source, rootValue: heroRootObject });
  expect(res.data.heroes.every(h => h.powers.includes('strength'))).toBe(true);
});

test('get random hero', async () => {
  const source = `
    query {
      randomHero {
        name
      }
    }
  `;
  const res = await graphql({ schema, source, rootValue: heroRootObject });
  expect(typeof res.data.randomHero.name).toBe('string');
});
