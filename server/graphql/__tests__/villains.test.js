const { graphql, buildSchema } = require('graphql');
const { mergeTypes } = require('merge-graphql-schemas');
const { heroSchema } = require('../express-graphql/heroes');
const { villainSchema, villainRoot } = require('../express-graphql/villains');
const { movieSchema } = require('../express-graphql/movies');
const { logGraphqlErrors } = require('../../utils');

const schema = buildSchema(mergeTypes([heroSchema, villainSchema, movieSchema]));

test('get villain by name', async () => {
  const source = `
    query {
      villains(name: "magneto") {
        name
        powers
        movies {
          name
        }
      }
    }
  `;
  const res = await graphql({ schema, source, rootValue: villainRoot }).then(logGraphqlErrors);
  const [magneto] = res.data.villains;
  expect(magneto.name).toBe('Magneto');
  expect(magneto.powers).toEqual(['magnetism']);
  expect(magneto.movies.length).toBeGreaterThan(0);
});

test('uppercase name', async () => {
  const source = `
    query {
      villains(name: "Magneto") {
        name(shouldUpperCase: true)
      }
    }
  `;
  const res = await graphql({ schema, source, rootValue: villainRoot }).then(logGraphqlErrors);
  const [magneto] = res.data.villains;
  expect(magneto.name).toBe('MAGNETO');
});

test('get villain by power', async () => {
  const source = `
    query {
      villains(power: "magnetism") {
        name
        powers
      }
    }
  `;
  const res = await graphql({ schema, source, rootValue: villainRoot });
  expect(res.data.villains.every(v => v.powers.includes('magnetism'))).toBe(true);
});

test('get random villain', async () => {
  const source = `
    query {
      randomVillain {
        name
        movies {
          name
        }
      }
    }
  `;
  const res = await graphql({ schema, source, rootValue: villainRoot }).then(logGraphqlErrors);
  expect(typeof res.data.randomVillain.name).toBe('string');
});
