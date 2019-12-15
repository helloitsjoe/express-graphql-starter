import React from 'react';
import ReactDOM from 'react-dom';
// import { ApolloProvider } from '@apollo/react-hooks';
import { MockedProvider } from '@apollo/react-testing';
import App from './app';
import { mockPlaces, mockHello, mockAdd, mockAddError } from './mock-data';
// import createApolloClient from './apollo-client';

// const client = createApolloClient();

const defaultMocks = [mockPlaces, mockHello('World'), mockHello('Jupiter'), mockAdd, mockAddError];

const WrappedApp = () => (
  <MockedProvider mocks={defaultMocks} addTypename={false}>
    {/* <ApolloProvider client={client}> */}
    <App />
    {/* </ApolloProvider> */}
  </MockedProvider>
);

ReactDOM.render(<WrappedApp />, document.querySelector('#main'));
