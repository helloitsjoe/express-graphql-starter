const { graphql, buildSchema } = require('graphql');
const { heroSchema, heroRootObject } = require('../heroes');

const schema = buildSchema(heroSchema);

test('get hero by name', async () => {
  const source = `
    query {
      heroes(name: "indiana jones") {
        name
      }
    }
  `;
  const res = await graphql({ schema, source, rootValue: heroRootObject });
  const [indy] = res.data.heroes;
  expect(indy.name).toBe('Indiana Jones');
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
