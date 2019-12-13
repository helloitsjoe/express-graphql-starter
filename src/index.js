import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import App, { PLACES_QUERY, HELLO_QUERY, ADD_PLACE } from './app';
import createApolloClient from './apollo-client';
// import { createMockClient } from 'mock-apollo-client';

const client = createApolloClient();
// const client = createMockClient();

// const places = [{ name: 'world' }, { name: 'mars' }];

// const placesHandler = () => Promise.resolve({ data: { places } });
// const helloHandler = p => Promise.resolve({ data: { place: { name: p.placeName } } });
// const addPlaceHandler = p =>
//   // Promise.resolve({ data: { add: places.concat({ name: p.placeName }) } });
//   Promise.reject(new Error('funky'));

// client.setRequestHandler(PLACES_QUERY, placesHandler);
// client.setRequestHandler(HELLO_QUERY, helloHandler);
// client.setRequestHandler(ADD_PLACE, addPlaceHandler);

const WrappedApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<WrappedApp />, document.querySelector('#main'));
