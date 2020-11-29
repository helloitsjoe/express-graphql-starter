const express = require('express');
const jwt = require('express-jwt');
const path = require('path');
const http = require('http');
const graphql = require('./routes/graphql');
const apolloServer = require('./routes/apolloServer');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

const makeServer = async (port = PORT) => {
  // TODO: Register user
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(express.json());
  // app.use(jwt({ secret: 'I am so secret!', algorithms: ['HS256'] }));

  if (process.env.EXPRESS_GRAPHQL) {
    app.use('/graphql', graphql);
  } else {
    // ApolloServer has it's own integration with express, can't use app.use
    apolloServer.applyMiddleware({ app });
  }

  // App is already listening
  if (server.address()) return Promise.resolve(server);

  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      if (process.env.NODE_ENV !== 'test') {
        console.log(`Serving site at http://${HOST}:${port}/`);
        console.log(`Serving GQL at http://${HOST}:${port}/graphql`);
      }
      return resolve(server);
    });

    server.on('error', error => {
      console.error(error);
      if (error.syscall !== 'listen') {
        reject(error);
      }

      const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          reject(error);
      }
    });
  });
};

module.exports = makeServer;
