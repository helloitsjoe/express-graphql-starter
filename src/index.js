import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { MockedProvider } from '@apollo/react-testing';
import App, { PLACES_QUERY, HELLO_QUERY, ADD_PLACE } from './app';
import createApolloClient from './apollo-client';

const client = createApolloClient();

const places = [{ name: 'World' }, { name: 'Mars' }];

const mockPlaces = {
  request: { query: PLACES_QUERY, variables: {} },
  result: { data: { places } },
};
const mockHello = placeName => ({
  request: { query: HELLO_QUERY, variables: { placeName } },
  result: { data: { place: { name: placeName } } },
});

const mockAddError = {
  request: { query: ADD_PLACE, variables: { placeName: 'Jupiter' } },
  result: { errors: [new Error('phooey')] },
};

const mockAdd = {
  request: { query: ADD_PLACE, variables: { placeName: 'Jupiter' } },
  result: { data: { add: { name: places.concat({ name: 'Jupiter' }) } } },
};

const defaultMocks = [mockPlaces, mockHello('World'), mockHello('Jupiter'), mockAddError, mockAdd];

const WrappedApp = () => (
  // <MockedProvider mocks={defaultMocks} addTypename={false}>
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  // </MockedProvider>
);

ReactDOM.render(<WrappedApp />, document.querySelector('#main'));
