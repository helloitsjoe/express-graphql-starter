import { graphql } from 'graphql';
import { schema } from '../rootSchemas';
import { logGraphqlErrors } from '../../utils';
import { makeAPI } from '../db';

// makeAPI automatically populates hero, villain, and movie DBs
// and also allows for them to be passed in. Right now the default
// data is mock data, but if the default were to use a real DB,
// we could inject mock data here.
const contextValue = { db: makeAPI() };

test('get villain by name', async () => {
  const source = `
    query {
      villain(name: "magneto") {
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
  const magneto = res.data.villain;
  expect(magneto.name).toBe('Magneto');
  expect(magneto.powers).toEqual(['magnetism']);
  const xMen = magneto.movies.find(m => m.title.match(/x-men/i));
  expect(xMen.villains.some(h => h.name.match(/magneto/i))).toBe(true);
});

test('get villains by id', async () => {
  const source = `
    query {
      villains(ids: [9, 10]) {
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
      villain(name: "Magneto") {
        name(shouldUpperCase: true)
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue }).then(logGraphqlErrors);
  const magneto = res.data.villain;
  expect(magneto.name).toBe('MAGNETO');
});

test('get all villains', async () => {
  const source = `
    query {
      allVillains {
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
  const { allVillains } = res.data;
  expect(allVillains.length).toBe(6);
  expect(allVillains.every(v => v.powers.length > 0)).toBe(true);
  expect(allVillains.every(v => v.movies.length > 0)).toBe(true);
  expect(allVillains.every(v => v.movies.every(m => m.heroes.length > 0))).toBe(true);
  expect(allVillains.every(v => v.movies.every(m => m.villains.length > 0))).toBe(true);
});

test('get villain by power', async () => {
  const source = `
    query {
      allVillains(power: "magnetism") {
        name
        powers
      }
    }
  `;
  const res = await graphql({ schema, source, contextValue });
  expect(res.data.allVillains.every(v => v.powers.includes('magnetism'))).toBe(true);
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
