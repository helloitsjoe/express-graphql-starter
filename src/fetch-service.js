import fetchQuery from './fetch-query';

const QUERY = `
  query SayHello($placeName: String!) {
    place(name: $placeName)
  }
`;

const PLACES = `
  query {
    places
  }
`;

const MUTATION = `
  mutation AddNewTarget($placeName: String!) {
    add(name: $placeName)
  }
`;

export const sayHello = placeName => fetchQuery({ query: QUERY, variables: { placeName } });

export const getPlaces = () => fetchQuery({ query: PLACES });

export const addPlace = placeName => fetchQuery({ query: MUTATION, variables: { placeName } });
