#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require('./app');
const debug = require('debug')('express-gql:server');
const http = require('http');
const os = require('os');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  if (typeof addr === 'string') {
    debug(`Listening on pipe ${addr}`);
  }
  logIPAddress(addr.port);
  debug(`Listening on port ${addr.port}`);
  debug(`Serving site at http://localhost:${addr.port}/`);
  debug(`Running GQL API server at http://localhost:${addr.port}/graphql`);
}

/**
 * Log the private IP address to the console
 */
function logIPAddress(port) {
  const ifaces = os.networkInterfaces();
  const ifKeys = Object.keys(ifaces);
  const ip = ifKeys.reduce((final, curr) => {
    const config = ifaces[curr].find(config =>
      config.address.includes('192.168')
    );
    return config ? config.address : final;
  }, '');
  debug(`Listening on http://${ip}:${port}`);
}
