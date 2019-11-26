import React, { Component } from 'react';
import { fetchQuery } from './fetchService';
import AddPlace from './add-place';

const query = `
  query SayHello($placeName: String!) {
    getPlace(place: $placeName)
  }
`;

class App extends Component {
  state = {
    loading: true,
    error: false,
    errorMessage: '',
    query: '',
  };

  componentDidMount() {
    this.fetchData();
  }

  handleClick = name => () => {
    this.fetchData(name);
  };

  fetchData = (placeName = 'World') => {
    const variables = { placeName };

    fetchQuery({ query, variables })
      .then(result => {
        // TODO: replace getPlace with 'place'
        this.setState({ loading: false, query: result.data.getPlace });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          loading: false,
          error: true,
          errorMessage: err.message,
        });
      });
  };

  render() {
    const { loading, error, errorMessage, query } = this.state;
    if (loading) {
      return <h3 className="main">Loading...</h3>;
    }
    if (error) {
      return <h3 className="error main">Error: {errorMessage}</h3>;
    }

    return (
      <div className="main">
        <h3>{query}</h3>
        <button onClick={this.handleClick('Mars')}>Say hello to Mars</button>
        <button onClick={this.handleClick('World')}>Say hello to World</button>
        {/* <AddPlace /> */}
      </div>
    );
  }
}

export default App;
