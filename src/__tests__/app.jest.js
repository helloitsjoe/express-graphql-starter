import React from 'react';
import { render, waitForElement, fireEvent } from '@testing-library/react';
import { ApolloProvider } from 'react-apollo';
import { createMockClient } from 'mock-apollo-client';
import RawApp, { PLACES_QUERY, HELLO_QUERY, ADD_PLACE } from '../app';

const c = createMockClient();

const places = ['World', 'Mars'];

c.setRequestHandler(PLACES_QUERY, () => Promise.resolve({ data: { places } }));
c.setRequestHandler(HELLO_QUERY, p => Promise.resolve({ data: { place: p.placeName } }));
c.setRequestHandler(ADD_PLACE, p => Promise.resolve({ data: { add: [...places, p.placeName] } }));

const withApollo = Component => props => (
  <ApolloProvider client={c}>
    <Component {...props} />
  </ApolloProvider>
);

const App = withApollo(RawApp);

beforeEach(() => {
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
