const getErrorMessage = text => (/{/.test(text) ? JSON.parse(text).errors[0].message : text);

const getCookie = cookie =>
  document.cookie
    .split(';')
    .find(c => new RegExp(cookie).test(c))
    ?.split('=')[1]
    ?.trim();

const fetchQuery = ({ query, variables, shouldError = false }) => {
  console.log('token', getCookie('gql-example-token'));
  return fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getCookie('gql-example-token')}`,
    },
    body: JSON.stringify({ query, variables }),
  }).then(res => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldError) {
          return reject(new Error('Oh noes!'));
        }
        if (res.ok) {
          return resolve(res.json());
        }
        // Handle errors and rethrow
        return res.text().then(text => {
          const message = getErrorMessage(text);
          return reject(new Error(`${res.status} - ${message}`));
        });
      }, 500);
    });
  });
};

export default fetchQuery;
