import gql from 'graphql-tag';
import fetchQuery from './fetch-query';

export const QUERY = gql`
  query SayHello($placeName: String!) {
    place(name: $placeName)
  }
`;

export const PLACES = `
  query {
    places
  }
`;

export const MUTATION = `
  mutation AddNewTarget($placeName: String!) {
    add(name: $placeName)
  }
`;

export const sayHello = placeName => fetchQuery({ query: QUERY, variables: { placeName } });

export const getPlaces = () => fetchQuery({ query: PLACES });

export const addPlace = placeName => fetchQuery({ query: MUTATION, variables: { placeName } });
