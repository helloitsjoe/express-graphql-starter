import { graphql } from 'graphql';
import { schema, rootValue } from '../rootSchemas';
import { logGraphqlErrors } from '../../utils';

test('get villain by name', async () => {
  const source = `
    query {
      villains(name: "magneto") {
        name
        powers
        movies {
          name
          villains {
            name
          }
        }
      }
    }
  `;
  const res = await graphql({ schema, source, rootValue }).then(logGraphqlErrors);
  const [magneto] = res.data.villains;
  expect(magneto.name).toBe('Magneto');
  expect(magneto.powers).toEqual(['magnetism']);
  const xMen = magneto.movies.find(m => m.name.match(/x-men/i));
  expect(xMen.villains.some(h => h.name.match(/magneto/i))).toBe(true);
});

test('uppercase name', async () => {
  const source = `
    query {
      villains(name: "Magneto") {
        name(shouldUpperCase: true)
      }
    }
  `;
  const res = await graphql({ schema, source, rootValue }).then(logGraphqlErrors);
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
  const res = await graphql({ schema, source, rootValue });
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
  const res = await graphql({ schema, source, rootValue }).then(logGraphqlErrors);
  expect(typeof res.data.randomVillain.name).toBe('string');
});
