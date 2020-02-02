const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const graphql = require('./routes/graphql');

const app = express();
const server = http.createServer(app);

const makeServer = async (port = 3000) => {
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(bodyParser.json());
  // cors

  app.use('/', index);
  app.use('/graphql', graphql);

  // App is already listening
  if (server.address()) return Promise.resolve(server);

  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      if (process.env.NODE_ENV !== 'test') {
        console.log(`Serving site at http://localhost:${port}/`);
        console.log(`Running GQL API server at http://localhost:${port}/graphql`);
        // logIPAddress(port);
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
