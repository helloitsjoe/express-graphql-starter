import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import App from './app';
import createApolloClient from './apollo-client';

const client = createApolloClient();

const WrappedApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<WrappedApp />, document.querySelector('#main'));
