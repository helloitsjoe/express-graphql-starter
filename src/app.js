import React, { useEffect } from 'react';
import { fetchQuery } from './fetchService';
import AddPlace from './add-place';

const QUERY = `
  query SayHello($placeName: String!) {
    place(name: $placeName)
  }
`;

const MUTATION = `
  mutation AddNewTarget($placeName: String!) {
    add(name: $placeName)
  }
`;

const App = () => {
  const [{ clickValue, loading, error, value, helloTarget }, dispatch] = React.useReducer(
    (s, a) => {
      switch (a.type) {
        case 'fetch':
          return { ...s, loading: true, error: '' };
        case 'fetch_success':
          console.log('success', a.payload);
          return { ...s, loading: false, error: '', helloTarget: a.payload };
        case 'fetch_error':
          return { ...s, loading: false, error: a.payload };
        case 'clicked':
          return { ...s, clickValue: a.payload };
        case 'input':
          return { ...s, value: a.payload };
        default:
          return s;
      }
    },
    {
      loading: true,
      error: '',
      helloTarget: '',
      value: '',
      clickValue: 'World',
    }
  );

  // It's suprisingly hard to cleanly swap out query for mutation. the query
  // itself isn't hard to pass in, but using typical service modlues where you
  // abstract the `fetchQuery` call away is difficult. Also the data that gets
  // returned is weird - you have to know if you're getting 'place' or 'add' off
  // of res.data. This would become more difficult the more queries you have.
  useEffect(
    () => {
      dispatch({ type: 'fetch' });
      fetchQuery({ query: QUERY, variables: { placeName: clickValue } })
        .then(result => {
          dispatch({ type: 'fetch_success', payload: result.data.place });
        })
        .catch(err => {
          dispatch({ type: 'fetch_error', payload: err });
        });
    },
    [clickValue]
  );

  const handleClick = payload => dispatch({ type: 'clicked', payload });
  const handleChange = e => dispatch({ type: 'input', payload: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    dispatch({ type: 'fetching' });
    fetchQuery({ query: MUTATION, variables: { placeName: value } })
      .then(result => {
        dispatch({ type: 'fetch_success', payload: result.data.add });
      })
      .catch(err => {
        dispatch({ type: 'fetch_error', payload: err });
      });
  };

  if (loading) {
    return <h3 className="main">Loading...</h3>;
  }
  if (error) {
    return <h3 className="error main">Error: {error}</h3>;
  }

  return (
    <div className="main">
      <h3>Hello, {helloTarget}!</h3>
      <button type="button" onClick={() => handleClick('Mars')}>
        Say hello to Mars
      </button>
      <button type="button" onClick={() => handleClick('World')}>
        Say hello to World
      </button>
      <AddPlace value={value} onChange={handleChange} onSubmit={handleSubmit} />
    </div>
  );
};

export default App;
