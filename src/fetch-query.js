const getErrorMessage = text => (/{/.test(text) ? JSON.parse(text).errors[0].message : text);

// const QUERY = `
//   query SayHello($placeName: String!) {
//     place(name: $placeName)
//   }
// `;

// const PLACES = `
//   query {
//     places
//   }
// `;

// const MUTATION = `
//   mutation AddNewTarget($placeName: String!) {
//     add(name: $placeName)
//   }
// `;

const fetchQuery = ({ query, variables }) => {
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
      const message = getErrorMessage(text);
      throw new Error(`${res.status} - ${message}`);
    });
  });
};

export default fetchQuery;
// export const sayHello = placeName => fetchQuery({ query: QUERY, variables: { placeName } });

// export const getPlaces = () => fetchQuery({ query: PLACES });

// export const addPlace = placeName => fetchQuery({ query: MUTATION, variables: { placeName } });
