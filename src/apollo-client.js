import ApolloClient from 'apollo-boost';

const createApolloClient = (fetch = window.fetch) =>
  new ApolloClient({
    uri: '/graphql',
    fetch,
  });

export default createApolloClient;
