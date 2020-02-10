const getErrorMessage = text => (/{/.test(text) ? JSON.parse(text).errors[0].message : text);

const fetchQuery = ({ query, variables, shouldError = false }) => {
  return fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
