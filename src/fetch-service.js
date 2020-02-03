import fetchQuery from './fetch-query';

const QUERY = `
  query SayHello($planetName: String!) {
    planet(name: $planetName)
  }
`;

const PLANETS = `
  query {
    planets
  }
`;

const MUTATION = `
  mutation AddNewTarget($planetName: String!) {
    addPlanet(name: $planetName)
  }
`;

export const sayHello = planetName => fetchQuery({ query: QUERY, variables: { planetName } });

export const getPlanets = () => fetchQuery({ query: PLANETS });

export const addPlanet = planetName => fetchQuery({ query: MUTATION, variables: { planetName } });
