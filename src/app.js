import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import gql from 'graphql-tag';
// import { sayHello, addPlace, getPlaces } from './fetch-service';
import AddPlace from './add-place';

const App = ({ loading, places, error, mutate, result }) => {
  // console.log(`sayHello:`, sayHello);
  console.log(`result:`, result);
  // console.log(`helloTarget:`, helloTarget);
  const helloTarget = result.place;
  const [{ value }, dispatch] = React.useReducer(
    (s, a) => {
      switch (a.type) {
        // case 'fetch':
        //   return { ...s, loading: true, error: '' };
        // case 'fetch_success':
        //   console.log('success', a.payload);
        //   return { ...s, loading: false, error: '', helloTarget: a.payload };
        // case 'fetch_places_success':
        //   console.log('places:', a.payload);
        //   return { ...s, loading: false, error: '', places: a.payload };
        // case 'add_place_success':
        //   console.log('place:', a.payload);
        //   return { ...s, loading: false, error: '', places: s.places.concat(a.payload) };
        // case 'fetch_error':
        //   return { ...s, loading: false, error: a.payload };
        case 'input':
          return { ...s, value: a.payload };
        default:
          return s;
      }
    },
    {
      // loading: true,
      // error: '',
      // helloTarget: '',
      // places: [],
      value: '',
    }
  );

  const handleClick = clickValue => {
    mutate({ variables: { placeName: clickValue } });
  };

  const handleChange = e => dispatch({ type: 'input', payload: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
  };

  if (loading) {
    return <h3 className="main">Loading...</h3>;
  }
  if (error) {
    return <h3 className="error main">Error: {error.message}</h3>;
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

App.propTypes = {
  places: PropTypes.arrayOf(PropTypes.string),
  loading: PropTypes.bool,
};

App.defaultProps = {
  places: [],
  loading: true,
};

export const PLACES_QUERY = gql`
  query {
    places
  }
`;

export const HELLO_QUERY = gql`
  mutation SayHello($placeName: String!) {
    place(name: $placeName)
  }
`;

export const ADD_PLACE = `
  mutation AddNewTarget($placeName: String!) {
    add(name: $placeName)
  }
`;

export default compose(
  graphql(PLACES_QUERY, {
    options: { variables: {} },
    props: props => console.log('props:', props) || props.data,
  }),
  graphql(HELLO_QUERY, {
    options: { ignoreResults: false },
    props: props =>
      console.log('props:', props) || {
        // sayHello: props.mutate,
        // helloTarget: props.result.place,
        // error: props.result.error,
        ...props,
      },
  })
)(App);
