import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { sayHello, addPlace, getPlaces } from './fetch-service';
import AddPlace from './add-place';

export const useAsyncState = () => {
  const [state, dispatch] = React.useReducer(
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
          return { ...s, loading: false, error: '', places: a.payload };
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

  const handleFetch = (type, dataProp) => result =>
    Promise.resolve(result)
      .then(res => {
        dispatch({ type, payload: res.data[dataProp] });
      })
      .catch(err => {
        dispatch({ type: 'fetch_error', payload: err.message });
      });

  useEffect(() => {
    dispatch({ type: 'fetch' });
    getPlaces().then(handleFetch('fetch_places_success', 'places'));
  }, []);

  const handleSayHello = clickValue => {
    dispatch({ type: 'fetch' });
    sayHello(clickValue).then(handleFetch('fetch_success', 'place'));
  };

  const handleAddPlace = e => {
    e.preventDefault();
    dispatch({ type: 'fetch' });
    addPlace(state.value).then(handleFetch('add_place_success', 'add'));
  };

  const handleInput = e => dispatch({ type: 'input', payload: e.target.value });

  return { ...state, onSayHello: handleSayHello, onInput: handleInput, onAddPlace: handleAddPlace };
};

const App = ({ loading, error, value, places, helloTarget, onSayHello, onInput, onAddPlace }) => {
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
        <button key={place} type="button" onClick={() => onSayHello(place)}>
          Say hello to {place}
        </button>
      ))}
      <AddPlace places={places} value={value} onChange={onInput} onSubmit={onAddPlace} />
    </div>
  );
};

App.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  value: PropTypes.string,
  helloTarget: PropTypes.string,
  places: PropTypes.arrayOf(PropTypes.string),
  onInput: PropTypes.func,
  onSayHello: PropTypes.func,
  onAddPlace: PropTypes.func,
};

App.defaultProps = {
  loading: true,
  error: '',
  value: '',
  helloTarget: '',
  places: [],
  onInput() {},
  onSayHello() {},
  onAddPlace() {},
};

export default function WrappedApp() {
  return <App {...useAsyncState()} />;
}
