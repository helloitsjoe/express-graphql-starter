import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import AddPlace from './add-place';

export const PLACES_QUERY = gql`
  query {
    places {
      name
    }
  }
`;

export const HELLO_QUERY = gql`
  query SayHello($placeName: String!) {
    place(name: $placeName) {
      name
    }
  }
`;

export const ADD_PLACE = gql`
  mutation AddNewPlace($placeName: String!) {
    add(name: $placeName) {
      name
    }
  }
`;

export const useFetch = () => {
  const places = useQuery(PLACES_QUERY);
  const [addPlace, result] = useMutation(ADD_PLACE);
  const [sayHello, hello] = useLazyQuery(HELLO_QUERY);

  const initialPlaces = places.data && places.data.places;

  const [newPlaces, setNewPlaces] = React.useState([]);

  React.useEffect(
    () => {
      setNewPlaces(initialPlaces);
    },
    [initialPlaces]
  );

  const optimisticAddPlace = placeName => {
    setNewPlaces(p => (p || []).concat({ name: placeName }));
    addPlace({ variables: { placeName } }).catch(err => {
      setNewPlaces(p => p.filter(({ name }) => name !== placeName));
    });
  };

  return {
    newPlaces,
    loading: places.loading,
    loadingNewPlace: hello.loading,
    addError: result.error,
    // newPlaces: result.data && result.data.add,
    helloTarget: hello.data && hello.data.place.name,
    initialPlaces,
    sayHello: placeName => sayHello({ variables: { placeName } }),
    addPlace: optimisticAddPlace,
  };
};

const App = ({
  error,
  loading,
  newPlaces,
  helloTarget,
  initialPlaces,
  loadingNewPlace,
  addError,
  addPlace,
  sayHello,
}) => {
  const [value, setValue] = React.useState('');
  const places = newPlaces || initialPlaces;

  const handleChange = e => setValue(e.target.value);
  const handleSubmit = e => {
    e.preventDefault();
    addPlace(value);
  };

  if (loading) {
    return <h3 className="main">Loading...</h3>;
  }
  if (error) {
    return <h3 className="error main">Error: {error}</h3>;
  }

  return (
    <div className="main">
      {loadingNewPlace ? (
        <h3 className="main">Loading...</h3>
      ) : (
        <h3>{helloTarget ? `Hello, ${helloTarget}!` : 'Click a button to say hello!'}</h3>
      )}
      {places.map(({ name }) => (
        <button key={name} type="button" onClick={() => sayHello(name)}>
          Say hello to {name}
        </button>
      ))}
      <AddPlace places={places} value={value} onChange={handleChange} onSubmit={handleSubmit} />
      {addError && <p className="error">Error! {addError.message}</p>}
    </div>
  );
};

export default function WrappedApp() {
  return <App {...useFetch()} />;
}
