/**
 * @jest-environment node
 */
const axios = require('axios');
const makeServer = require('../../makeServer');
const { handleAxiosError } = require('../../utils');

const PORT = 1234;
const rootUrl = `http://localhost:${PORT}`;
const graphqlUrl = `${rootUrl}/graphql`;

let server;
beforeAll(async () => {
  server = await makeServer(PORT);
});

afterAll(() => {
  server.close();
});

// Examples of graphql API tests
test('hero API test', async () => {
  const query = `
    query {
      heroes {
        name
        powers
        movies {
          name
        }
      }
    }
  `;
  const res = await axios.post(graphqlUrl, { query }).catch(handleAxiosError);
  const { heroes } = res.data.data;
  const allHeroesHaveNames = heroes.every(h => typeof h.name === 'string');
  const allHeroesHavePowers = heroes.every(h => h.powers.length > 0);
  const allHeroesHaveMovies = heroes.every(h => h.movies.length > 0);
  expect(allHeroesHaveNames).toBe(true);
  expect(allHeroesHavePowers).toBe(true);
  expect(allHeroesHaveMovies).toBe(true);
});

test('movies API test', async () => {
  const query = `
    query {
      movies {
        name
        heroes {
          name
        }
        villains {
          name
        }
      }
    }
  `;
  const res = await axios.post(graphqlUrl, { query }).catch(handleAxiosError);
  const { movies } = res.data.data;
  const allMoviesHaveNames = movies.every(m => typeof m.name === 'string');
  const allMoviesHaveHeroes = movies.every(m => m.heroes.length > 0);
  const allMoviesHaveVillains = movies.every(m => m.villains.length > 0);
  expect(allMoviesHaveNames).toBe(true);
  expect(allMoviesHaveHeroes).toBe(true);
  expect(allMoviesHaveVillains).toBe(true);
});

xtest('planets API test', async () => {
  const query = `
    query {
      planet(name: "Mars")
      planets
    }
  `;
  const res = await axios.post(graphqlUrl, { query }).catch(handleAxiosError);
  const { planets, planet } = res.data.data;
  expect(planets.length).toBeGreaterThan(0);
  expect(planet).toBe('Mars');
});
