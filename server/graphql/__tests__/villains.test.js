import { graphql } from 'graphql';
import { schema } from '../rootSchemas';
import { logGraphqlErrors } from '../../utils';
import { withLoaders, makeAPI } from '../db';

const contextValue = { db: withLoaders(makeAPI()) };

test('get villain by name', async () => {
  const source = `
    query {
      villains(names: ["magneto"]) {
        name
        powers
        movies {
          title
          villains {
            name
          }
        }
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue }).then(logGraphqlErrors);
  const [magneto] = res.data.villains;
  expect(magneto.name).toBe('Magneto');
  expect(magneto.powers).toEqual(['magnetism']);
  const xMen = magneto.movies.find(m => m.title.match(/x-men/i));
  expect(xMen.villains.some(h => h.name.match(/magneto/i))).toBe(true);
});

test('get multiple villains by name', async () => {
  const source = `
    query {
      villains(names: ["magneto", "bane"]) {
        name
        powers
        movies {
          title
          villains {
            name
          }
        }
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue }).then(logGraphqlErrors);
  const [magneto, bane] = res.data.villains;

  expect(magneto.name).toBe('Magneto');
  expect(magneto.powers).toEqual(['magnetism']);
  const xMen = magneto.movies.find(m => m.title.match(/x-men/i));
  expect(xMen.villains.some(h => h.name.match(/magneto/i))).toBe(true);

  expect(bane.name).toBe('Bane');
  expect(bane.powers).toEqual(['strength', 'invulnerability']);
  const batman = bane.movies.find(m => m.title.match(/dark knight/i));
  expect(batman.villains.some(h => h.name.match(/bane/i))).toBe(true);
});

test('uppercase name', async () => {
  const source = `
    query {
      villains(names: ["Magneto"]) {
        name(shouldUpperCase: true)
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue }).then(logGraphqlErrors);
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
  const res = await graphql({ schema, source, contextValue });
  expect(res.data.villains.every(v => v.powers.includes('magnetism'))).toBe(true);
});

test('get random villain', async () => {
  const source = `
    query {
      randomVillain {
        name
        movies {
          title
          villains {
            name
          }
        }
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue }).then(logGraphqlErrors);
  const { randomVillain } = res.data;
  expect(typeof randomVillain.name).toBe('string');
  const [firstMovie] = randomVillain.movies;
  expect(firstMovie.villains.some(v => v.name === randomVillain.name)).toBe(true);
});
