import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
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
  mutation AddNewTarget($placeName: String!) {
    add(name: $placeName)
  }
`;

const App = ({
  loading,
  loadingNewPlace,
  initialPlaces,
  error,
  addPlace,
  sayHello,
  helloTarget,
  newPlaces,
}) => {
  const [value, setValue] = React.useState('');
  console.log(`newPlaces:`, newPlaces);
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
      {places.map(place => (
        <button key={place} type="button" onClick={() => sayHello(place)}>
          Say hello to {place}
        </button>
      ))}
      <AddPlace places={places} value={value} onChange={handleChange} onSubmit={handleSubmit} />
    </div>
  );
};

const mapPlacesToProps = props => ({
  ...props.data,
  initialPlaces: props.data.places,
});

const mapHelloToProps = props => ({
  loadingNewPlace: props.data.loading,
  helloTarget: props.data.place,
  sayHello: placeName => props.data.refetch({ placeName }),
});

const mapAddToProps = props => ({
  newPlaces: props.result.add,
  addPlace: placeName => props.mutate({ variables: { placeName } }),
});

const queryOptions = { variables: { placeName: '' }, fetchPolicy: 'cache-first' };
const mutationOptions = { fetchPolicy: 'no-cache', ignoreResults: false };

export default compose(
  graphql(PLACES_QUERY, { props: mapPlacesToProps }),
  graphql(HELLO_QUERY, { options: queryOptions, props: mapHelloToProps }),
  graphql(ADD_PLACE, { options: mutationOptions, props: mapAddToProps })
)(App);
