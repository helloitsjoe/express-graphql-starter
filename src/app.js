import React, { useEffect } from 'react';
import { sayHello, addPlace, getPlaces } from './fetch-service';
import AddPlace from './add-place';

const App = () => {
  const [{ places, loading, error, value, helloTarget }, dispatch] = React.useReducer(
    (s, a) => {
      switch (a.type) {
        case 'fetch':
          return { ...s, loading: true, error: '' };
        case 'fetch_success':
          console.log('success', a.payload);
          return { ...s, loading: false, error: '', helloTarget: a.payload };
        case 'fetch_places_success':
          console.log('places:', a.payload);
          return { ...s, loading: false, error: '', places: a.payload };
        case 'add_place_success':
          console.log('place:', a.payload);
          return { ...s, loading: false, error: '', places: s.places.concat(a.payload) };
        case 'fetch_error':
          return { ...s, loading: false, error: a.payload };
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
      places: [],
      value: '',
    }
  );

  useEffect(() => {
    dispatch({ type: 'fetch' });
    getPlaces()
      .then(result => {
        dispatch({ type: 'fetch_places_success', payload: result.data.places });
      })
      .catch(err => {
        dispatch({ type: 'fetch_error', payload: err.message });
      });
  }, []);

  const handleClick = clickValue => {
    dispatch({ type: 'fetch' });
    sayHello(clickValue)
      .then(result => {
        dispatch({ type: 'fetch_success', payload: result.data.place });
      })
      .catch(err => {
        dispatch({ type: 'fetch_error', payload: err.message });
      });
  };

  const handleChange = e => dispatch({ type: 'input', payload: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    dispatch({ type: 'fetching' });
    addPlace(value)
      .then(result => {
        dispatch({ type: 'add_place_success', payload: result.data.add });
      })
      .catch(err => {
        dispatch({ type: 'fetch_error', payload: err.message });
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
      <h3>{helloTarget ? `Hello, ${helloTarget}!` : 'Click a button to say hello!'}</h3>
      {places.map(place => (
        <button key={place} type="button" onClick={() => handleClick(place)}>
          Say hello to {place}
        </button>
      ))}
      <AddPlace places={places} value={value} onChange={handleChange} onSubmit={handleSubmit} />
    </div>
  );
};

export default App;
