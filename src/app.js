import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import AddPlace from './add-place';

export const PLACES_QUERY = gql`
  query {
    places
  }
`;

export const HELLO_QUERY = gql`
  query SayHello($placeName: String!) {
    place(name: $placeName)
  }
`;

export const ADD_PLACE = gql`
  mutation AddNewPlace($placeName: String!) {
    add(name: $placeName)
  }
`;

export const useFetch = () => {
  const places = useQuery(PLACES_QUERY);
  const [addPlace, result] = useMutation(ADD_PLACE);
  const [sayHello, hello] = useLazyQuery(HELLO_QUERY);

  return {
    loading: places.loading,
    loadingNewPlace: hello.loading,
    newPlaces: result.data && result.data.add,
    helloTarget: hello.data && hello.data.place,
    initialPlaces: places.data && places.data.places,
    sayHello: placeName => sayHello({ variables: { placeName } }),
    addPlace: placeName => addPlace({ variables: { placeName } })
  };
};

const App = ({
  error,
  loading,
  newPlaces,
  helloTarget,
  initialPlaces,
  loadingNewPlace,
  addPlace,
  sayHello
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
        <h3>
          {helloTarget
            ? `Hello, ${helloTarget}!`
            : 'Click a button to say hello!'}
        </h3>
      )}
      {places.map(place => (
        <button key={place} type="button" onClick={() => sayHello(place)}>
          Say hello to {place}
        </button>
      ))}
      <AddPlace
        places={places}
        value={value}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default function WrappedApp() {
  return <App {...useFetch()} />;
}
