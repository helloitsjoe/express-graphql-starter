import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { sayHello, addPlanet, getPlanets } from './fetch-service';
import AddPlanet from './add-planet';

export const STATUS = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  PENDING: 'PENDING',
};

const { IDLE, LOADING, SUCCESS, ERROR, PENDING } = STATUS;

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
          return { ...s, status: IDLE, errorMessage: '', helloTarget: a.payload };
        case 'fetch_planets_success':
          console.log('fetch planets success:', a.payload);
          return { ...s, status: IDLE, errorMessage: '', planets: a.payload };
        case 'add_planet_pending':
          return {
            ...s,
            status: PENDING,
            planets: s.planets.concat(a.payload),
            pendingPlanet: a.payload,
          };
        case 'add_planet_success':
          console.log('add planet success:', a.payload);
          return { ...s, status: IDLE, pendingPlanet: '' };
        case 'add_planet_error':
          console.error('add planet error', a.payload);
          return {
            ...s,
            status: IDLE,
            addPlanetError: a.payload,
            planets: s.planets.filter(planet => console.log(planet) || planet !== s.pendingPlanet),
            pendingPlanet: '',
          };
        case 'fetch_error':
          return { ...s, status: ERROR, errorMessage: a.payload };
        case 'input':
          return { ...s, status: IDLE, addPlanetError: '', value: a.payload };
        default:
          return s;
      }
    },
    {
      status: LOADING,
      errorMessage: '',
      addPlanetError: '',
      helloTarget: '',
      pendingPlanet: '',
      planets: [],
      value: '',
      ...initialStateOverrides,
    }
  );

  const handleFetch = (type, dataProp) => result =>
    Promise.resolve(result)
      .then(res => {
        console.log('success');
        console.log(`res.data:`, res.data);
        console.log(`dataProp:`, dataProp);
        dispatch({ type, payload: res.data[dataProp] });
      })
      .catch(err => {
        console.log('error');
        dispatch({ type: 'fetch_error', payload: err.message });
      });

  useEffect(() => {
    dispatch({ type: 'fetch' });
    getPlanets().then(handleFetch('fetch_planets_success', 'planets'));
  }, []);

  const handleSayHello = clickValue => {
    if (cache.has(clickValue)) {
      dispatch({ type: 'fetch_success', payload: clickValue });
      return;
    }
    dispatch({ type: 'fetch' });
    sayHello(clickValue).then(handleFetch('fetch_success', 'planet'));
  };

  const handleAddPlanet = e => {
    e.preventDefault();
    dispatch({ type: 'add_planet_pending', payload: state.value });
    addPlanet(state.value)
      .then(res => {
        if (res.errors && res.errors.length) throw new Error(res.errors[0].message);
        dispatch({ type: 'add_planet_success' });
      })
      .catch(err => dispatch({ type: 'add_planet_error', payload: err.message }));
  };

  const handleInput = e => dispatch({ type: 'input', payload: e.target.value });

  return {
    ...state,
    onSayHello: handleSayHello,
    onInput: handleInput,
    onAddPlanet: handleAddPlanet,
  };
};

export const App = ({
  // loading,
  status,
  errorMessage,
  value,
  planets,
  helloTarget,
  onSayHello,
  onInput,
  onAddPlanet,
  addPlanetError,
}) => {
  if (status === LOADING) {
    return <h3 className="main">Loading...</h3>;
  }
  if (status === ERROR) {
    return <h3 className="error main">Error: {errorMessage}</h3>;
  }

  return (
    <div className="main">
      <h3>{helloTarget ? `Hello, ${helloTarget}!` : 'Click a button to say hello!'}</h3>
      {planets.map(planet => (
        <button key={planet} type="button" onClick={() => onSayHello(planet)}>
          Say hello to {planet}
        </button>
      ))}
      <AddPlanet
        error={addPlanetError}
        planets={planets}
        value={value}
        onChange={onInput}
        onSubmit={onAddPlanet}
      />
    </div>
  );
};

App.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  addPlanetError: PropTypes.string,
  value: PropTypes.string,
  helloTarget: PropTypes.string,
  planets: PropTypes.arrayOf(PropTypes.string),
  onInput: PropTypes.func,
  onSayHello: PropTypes.func,
  onAddPlanet: PropTypes.func,
};

App.defaultProps = {
  loading: true,
  error: '',
  value: '',
  helloTarget: '',
  addPlanetError: '',
  planets: [],
  onInput() {},
  onSayHello() {},
  onAddPlanet() {},
};

export default function AppContainer(props) {
  return <App {...useAsyncState(props)} />;
}
