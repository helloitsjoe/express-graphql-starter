/**
 * @jest-environment node
 */
const axios = require('axios');
const makeServer = require('../../makeServer');
const { handleAxiosError } = require('../../utils');

const PORT = 1235;
const rootUrl = `http://localhost:${PORT}`;
const registerUrl = `${rootUrl}/register`;

let server;
beforeAll(async () => {
  server = await makeServer(PORT);
});

afterAll(() => {
  server.close();
});

test('returns token for valid request', async () => {
  const { data } = await axios.post(registerUrl, { username: 'foo' }).catch(handleAxiosError);
  expect(data.token).toBeTruthy();
});
