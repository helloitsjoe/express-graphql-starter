import React, { Component } from 'react';

const query = `
  query SayHello($placeName: String!) {
    hello(place: $placeName)
  }
`;

class App extends Component {
  state = {
    loading: true,
    error: false,
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

    fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        // Handle errors
        return res.text().then(text => {
          const message =
            text[0] === '{' ? JSON.parse(text).errors[0].message : text;
          throw new Error(`${res.status} - ${message}`);
        });
      })
      .then(result => {
        this.setState({ loading: false, query: result.data.hello });
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
      return <h3>Loading...</h3>;
    }
    if (error) {
      return <h3 className="error">Error: {errorMessage}</h3>;
    }

    return (
      <div className="main">
        <h3>{query}</h3>
        <button onClick={this.handleClick('Mars')}>Say hello to Mars</button>
        <button onClick={this.handleClick('World')}>Say hello to World</button>
      </div>
    );
  }
}

export default App;
