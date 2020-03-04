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
      allHeroes {
        name
        powers
        movies {
          title
        }
      }
    }
  `;
  const res = await axios.post(graphqlUrl, { query }).catch(handleAxiosError);
  const { allHeroes } = res.data.data;
  const allHeroesHaveNames = allHeroes.every(h => typeof h.name === 'string');
  const allHeroesHavePowers = allHeroes.every(h => h.powers.length > 0);
  const allHeroesHaveMovies = allHeroes.every(h => h.movies.length > 0);
  expect(allHeroesHaveNames).toBe(true);
  expect(allHeroesHavePowers).toBe(true);
  expect(allHeroesHaveMovies).toBe(true);
});

test('movies API test', async () => {
  const query = `
    query {
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
  `;
  const res = await axios.post(graphqlUrl, { query }).catch(handleAxiosError);
  const { movies } = res.data.data;
  const allMoviesHaveTitles = movies.every(m => typeof m.title === 'string');
  const allMoviesHaveHeroes = movies.every(m => m.heroes.length > 0);
  const allMoviesHaveVillains = movies.every(m => m.villains.length > 0);
  expect(allMoviesHaveTitles).toBe(true);
  expect(allMoviesHaveHeroes).toBe(true);
  expect(allMoviesHaveVillains).toBe(true);
});

test('planets API test', async () => {
  const query = `
    query {
      planet(name: "Mars")
      planets
    }
  `;
  const res = await axios.post(graphqlUrl, { query }).catch(handleAxiosError);
  const { planets, planet } = res.data.data;
  expect(planet).toBe('Mars');
  expect(planets.length).toBeGreaterThan(0);
});
