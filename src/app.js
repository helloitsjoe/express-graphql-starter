import React, { useState, useEffect } from 'react';
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
  const [state, setState] = useState({
    loading: true,
    error: false,
    errorMessage: '',
    helloTarget: '',
    value: '',
    query: QUERY,
    clickValue: 'World',
  });

  useEffect(
    () => {
      setState(s => ({ ...s, loading: true }));
      // It's suprisingly hard to cleanly swap out query for mutation. the query
      // itself isn't hard to pass in, but using typical service modlues where you
      // abstract the `fetchQuery` call away is difficult. Also the data that gets
      // returned is weird - you have to know if you're getting 'place' or 'add' off
      // of res.data. This would become more difficult the more queries you have.
      fetchQuery({ query: state.query, variables: { placeName: state.clickValue } })
        .then(result => {
          console.log(`result.data:`, result.data);
          const { place, add } = result.data;
          setState(s => ({ ...s, loading: false, helloTarget: place || add }));
        })
        .catch(err => {
          setState({
            loading: false,
            error: true,
            errorMessage: err.message,
          });
        });
    },
    [state.clickValue, state.query]
  );

  const { loading, error, errorMessage, value, helloTarget } = state;

  const handleClick = clickValue => setState({ ...state, clickValue });
  const handleChange = e => setState({ ...state, value: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    setState(s => ({ ...s, query: MUTATION, clickValue: value }));
  };

  if (loading) {
    return <h3 className="main">Loading...</h3>;
  }
  if (error) {
    return <h3 className="error main">Error: {errorMessage}</h3>;
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
