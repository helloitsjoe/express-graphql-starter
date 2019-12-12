import React from 'react';
import { act, render, waitForElement, fireEvent, wait } from '@testing-library/react';
import { ApolloProvider } from '@apollo/react-hooks';
import { createMockClient } from 'mock-apollo-client';
import AppWithoutApollo, { useFetch, PLACES_QUERY, HELLO_QUERY, ADD_PLACE } from '../app';

let mockClient;
const places = [{ name: 'World' }, { name: 'Mars' }];

const withApollo = Component => props => (
  <ApolloProvider client={mockClient}>
    <Component {...props} />
  </ApolloProvider>
);

const App = withApollo(AppWithoutApollo);

beforeEach(() => {
  // Note: Make SURE to create the client in a beforeEach. If you create it
  // at the module level, the cache will not clear between tests,
  // leading to flakiness.
  mockClient = createMockClient();

  const placesHandler = () => Promise.resolve({ data: { places } });
  const helloHandler = p => Promise.resolve({ data: { place: { name: p.placeName } } });
  const addPlaceHandler = p =>
    Promise.resolve({ data: { add: places.concat({ name: p.placeName }) } });

  mockClient.setRequestHandler(PLACES_QUERY, placesHandler);
  mockClient.setRequestHandler(HELLO_QUERY, helloHandler);
  mockClient.setRequestHandler(ADD_PLACE, addPlaceHandler);

  // silence logs
  console.log = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('App', () => {
  it('loading screen', async () => {
    const { container, getByText } = render(<App />);
    expect(container.textContent).toMatch(/loading/i);
    await waitForElement(() => getByText(/Click a button to say hello/i));
  });

  it('gets initial buttons', async () => {
    const { getByText } = render(<App />);
    await waitForElement(() => [getByText(/say hello to world/i), getByText(/say hello to mars/i)]);
  });

  it('updates main text to button value', async () => {
    const { getByText, findByText } = render(<App />);
    await waitForElement(() => getByText(/Click a button to say hello/i));
    const worldButton = await findByText(/say hello to world/i);

    fireEvent.click(worldButton);

    await waitForElement(() => getByText(/hello, world/i));
  });

  it('adding a place adds a new button', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<App />);
    await waitForElement(() => getByText(/Click a button to say hello/i));
    const input = getByPlaceholderText(/add a new place/i);

    fireEvent.change(input, { target: { value: 'Jupiter' } });
    fireEvent.click(getByText(/add place/i));

    const jupiterButton = await findByText(/say hello to jupiter/i);

    fireEvent.click(jupiterButton);

    await waitForElement(() => getByText(/hello, jupiter/i));
  });

  it('add place button is disabled if place already exists', async () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    await waitForElement(() => getByText(/Click a button to say hello/i));
    const input = getByPlaceholderText(/add a new place/i);
    const addButton = getByText(/add place/i);

    expect(input.value).toBe('');
    expect(addButton.disabled).toBe(true);
    expect(getByText(/say hello to world/i)).toBeTruthy();

    fireEvent.change(input, { target: { value: 'worl' } });

    expect(addButton.disabled).toBe(false);

    // Ensure case insensitive
    fireEvent.change(input, { target: { value: 'world' } });

    expect(addButton.disabled).toBe(true);
  });
});

describe('useFetch', () => {
  const ApolloComp = withApollo(({ children }) => children(useFetch()));

  it('places query', async () => {
    let loading;
    let initialPlaces;
    render(
      <ApolloComp>
        {test => {
          ({ loading, initialPlaces } = test);
          return null;
        }}
      </ApolloComp>
    );

    expect(loading).toBe(true);
    expect(initialPlaces).toBe(undefined);

    await wait(() => {
      expect(loading).toBe(false);
      expect(initialPlaces).toEqual(places);
    });
  });

  it('hello query', async () => {
    let loadingNewPlace;
    let helloTarget;
    let sayHello;
    render(
      <ApolloComp>{test => ({ loadingNewPlace, helloTarget, sayHello } = test) && ''}</ApolloComp>
    );

    expect(loadingNewPlace).toBe(false);
    expect(helloTarget).toBe(undefined);

    act(() => sayHello('World'));
    expect(loadingNewPlace).toBe(true);

    await wait(() => {
      expect(loadingNewPlace).toBe(false);
      expect(helloTarget).toBe('World');
    });
  });

  it('addPlace mutation', async () => {
    let newPlaces;
    let addPlace;
    render(<ApolloComp>{test => ({ newPlaces, addPlace } = test) && ''}</ApolloComp>);

    expect(newPlaces).toBe(undefined);

    await act(() => addPlace('Jupiter'));

    await wait(() => expect(newPlaces.some(({ name }) => name === 'Jupiter')).toBe(true));
  });
});
