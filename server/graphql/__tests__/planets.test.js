import { graphql } from 'graphql';
import { schema, rootValue } from '../rootSchemas';
import { logGraphqlErrors } from '../../utils';
import { resetPlanets } from '../graphql-object/planets';
import { resetPlanets as resetPlanetsExpress } from '../express-graphql/planets';
import { resetPlanets as resetPlanetsExecutable } from '../executable-schema/planets';

afterEach(() => {
  resetPlanets();
  resetPlanetsExpress();
  resetPlanetsExecutable();
});

test('get planet by name', async () => {
  const source = `
    query {
      planet(name: "Mars")
    }
  `;
  const res = await graphql({ schema, source, rootValue }).then(logGraphqlErrors);
  expect(res.data.planet).toBe('Mars');
});

test('responds for unrecognized planet', async () => {
  const source = `
    query {
      planet(name: "Jupiter")
    }
  `;
  const res = await graphql({ schema, source, rootValue }).then(logGraphqlErrors);
  expect(res.data.planet).toBe("I don't know where Jupiter is!");
});

test('add planet', async () => {
  const source = `
    mutation {
      addPlanet(name: "Jupiter")
    }
  `;
  const res = await graphql({ schema, source, rootValue }).then(logGraphqlErrors);
  expect(res.data.addPlanet).toEqual(['World', 'Mars', 'Jupiter']);
});

test('get all planets', async () => {
  const source = `
    query {
      planets
    }
  `;
  const res = await graphql({ schema, source, rootValue }).then(logGraphqlErrors);
  expect(res.data.planets).toEqual(['World', 'Mars']);
});
