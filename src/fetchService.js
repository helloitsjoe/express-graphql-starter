const getMessage = text =>
  /{/.test(text) ? JSON.parse(text).errors[0].message : text;

export const fetchQuery = ({ query, variables }) => {
  return fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  }).then(res => {
    if (res.ok) {
      return res.json();
    }
    // Handle errors and rethrow
    return res.text().then(text => {
      const message = getMessage(text);
      throw new Error(`${res.status} - ${message}`);
    });
  });
};
