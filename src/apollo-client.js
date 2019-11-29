import ApolloClient from 'apollo-boost';
import fetchQuery from './fetch-query';

const createApolloClient = (fetch = window.fetch) =>
  new ApolloClient({
    uri: '/graphql',
    fetch,
  });

export default createApolloClient;
