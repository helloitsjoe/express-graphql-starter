import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { sayHello, addPlace, getPlaces } from './fetch-service';
import AddPlace from './add-place';

const STATUS = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

const { IDLE, LOADING, SUCCESS, ERROR } = STATUS;

const defaultCache = new Map();

export const useAsyncState = (initialStateOverrides, cache = defaultCache) => {
  const [state, dispatch] = React.useReducer(
    (s, a) => {
      switch (a.type) {
        case 'fetch':
          return { ...s, status: LOADING };
        case 'fetch_success':
          console.log('success', a.payload);
          cache.set(a.payload, true);
          return { ...s, loading: false, error: '', helloTarget: a.payload };
        case 'fetch_places_success':
          console.log('fetch places success:', a.payload);
          return { ...s, loading: false, error: '', places: a.payload };
        case 'add_place_pending':
          return {
            ...s,
            loading: false,
            error: '',
            places: s.places.concat(a.payload),
            pendingPlace: a.payload,
          };
        case 'add_place_success':
          console.log('add place success:', a.payload);
          return { ...s, loading: false, error: '', pendingPlace: '' };
        case 'add_place_error':
          console.error('add place error', a.payload);
          return {
            ...s,
            loading: false,
            addPlaceError: a.payload,
            places: s.places.filter(place => console.log(place) || place !== s.pendingPlace),
            pendingPlace: '',
          };
        case 'fetch_error':
          return { ...s, loading: false, error: a.payload };
        case 'input':
          return { ...s, addPlaceError: '', value: a.payload };
        default:
          return s;
      }
    },
    {
      status: IDLE,
      errorMessage: '',
      addPlaceError: '',
      helloTarget: '',
      pendingPlace: '',
      places: [],
      value: '',
      ...initialStateOverrides,
    }
  );

  const handleFetch = (type, dataProp) => result =>
    Promise.resolve(result)
      .then(res => {
        console.log('success');
        dispatch({ type, payload: res.data[dataProp] });
      })
      .catch(err => {
        console.log('error');
        dispatch({ type: 'fetch_error', payload: err.message });
      });

  useEffect(() => {
    dispatch({ type: 'fetch' });
    getPlaces().then(handleFetch('fetch_places_success', 'places'));
  }, []);

  const handleSayHello = clickValue => {
    if (cache.has(clickValue)) {
      dispatch({ type: 'fetch_success', payload: clickValue });
      return;
    }
    dispatch({ type: 'fetch' });
    sayHello(clickValue).then(handleFetch('fetch_success', 'place'));
  };

  const handleAddPlace = e => {
    e.preventDefault();
    dispatch({ type: 'add_place_pending', payload: state.value });
    addPlace(state.value)
      .then(res => {
        if (res.errors && res.errors.length) throw new Error(res.errors[0].message);
        dispatch({ type: 'add_place_success' });
      })
      .catch(err => dispatch({ type: 'add_place_error', payload: err.message }));
  };

  const handleInput = e => dispatch({ type: 'input', payload: e.target.value });

  return { ...state, onSayHello: handleSayHello, onInput: handleInput, onAddPlace: handleAddPlace };
};

export const App = ({
  loading,
  error,
  value,
  places,
  helloTarget,
  onSayHello,
  onInput,
  onAddPlace,
  addPlaceError,
}) => {
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
      <AddPlace
        error={addPlaceError}
        places={places}
        value={value}
        onChange={onInput}
        onSubmit={onAddPlace}
      />
    </div>
  );
};

App.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  addPlaceError: PropTypes.string,
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
  addPlaceError: '',
  places: [],
  onInput() {},
  onSayHello() {},
  onAddPlace() {},
};

export default function AppContainer(props) {
  return <App {...useAsyncState(props)} />;
}
