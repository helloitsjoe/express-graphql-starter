import React from 'react';
import { act, render, waitForElement, fireEvent, wait } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { places, mockPlaces, mockHello, mockAddError, mockAdd } from '../mock-data';
import App, { useFetch } from '../app';

const defaultMocks = [mockPlaces, mockHello('World'), mockHello('Jupiter'), mockAddError];

const withApollo = Component => ({ mocks = defaultMocks, ...props }) => (
  <MockedProvider mocks={mocks} addTypename={false}>
    <Component {...props} />
  </MockedProvider>
);

const AppWithApollo = withApollo(App);

describe('App', () => {
  it('loading screen', async () => {
    const { container, getByText } = render(<AppWithApollo />);
    expect(container.textContent).toMatch(/loading/i);
    await waitForElement(() => getByText(/Click a button to say hello/i));
  });

  it('gets initial buttons', async () => {
    const { getByText } = render(<AppWithApollo />);
    await waitForElement(() => [getByText(/say hello to world/i), getByText(/say hello to mars/i)]);
  });

  it('updates main text to button value', async () => {
    const { getByText, findByText } = render(<AppWithApollo />);
    await waitForElement(() => getByText(/Click a button to say hello/i));
    const worldButton = await findByText(/say hello to world/i);

    fireEvent.click(worldButton);

    await waitForElement(() => getByText(/hello, world/i));
  });

  it('adding a place adds a new button optimistically', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<AppWithApollo />);
    await waitForElement(() => getByText(/Click a button to say hello/i));
    const input = getByPlaceholderText(/add a new place/i);

    fireEvent.change(input, { target: { value: 'Jupiter' } });
    fireEvent.click(getByText(/add place/i));

    const jupiterButton = getByText(/say hello to jupiter/i);
    expect(queryByText(/error/i)).toBeFalsy();

    fireEvent.click(jupiterButton);

    // button should work even if an error is coming
    await waitForElement(() => getByText(/hello, jupiter/i));

    // error removes button and adds error text
    await wait(() => {
      expect(queryByText(/say hello to jupiter/i)).toBeFalsy();
      expect(queryByText(/error/i)).toBeTruthy();
    });
  });

  it('add place button is disabled if place already exists', async () => {
    const { getByPlaceholderText, getByText } = render(<AppWithApollo />);
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
    let addError;
    render(<ApolloComp>{test => ({ addError, newPlaces, addPlace } = test) && ''}</ApolloComp>);

    await wait(() => expect(newPlaces).toEqual(places));

    act(() => addPlace('Jupiter'));

    expect(newPlaces.some(({ name }) => name === 'Jupiter')).toBe(true);

    await wait(() => {
      expect(newPlaces.some(({ name }) => name === 'Jupiter')).toBe(false);
      expect(addError).toBeTruthy();
    });
  });
});
