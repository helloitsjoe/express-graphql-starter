import gql from 'graphql-tag';

export const PLACES_QUERY = gql`
  query {
    places {
      name
    }
  }
`;

export const HELLO_QUERY = gql`
  query SayHello($placeName: String!) {
    place(name: $placeName) {
      name
    }
  }
`;

export const ADD_PLACE = gql`
  mutation AddNewPlace($placeName: String!) {
    add(name: $placeName) {
      name
    }
  }
`;
