import React from 'react';
import { render, waitForElement, fireEvent, wait, act } from '@testing-library/react';
import AppContainer, { App, useAsyncState } from '../app';

jest.mock('../fetch-service', () => {
  const places = ['World', 'Mars'];
  return {
    sayHello: jest.fn(place => Promise.resolve({ data: { place } })),
    getPlaces: jest.fn().mockResolvedValue({ data: { places } }),
    addPlace: jest.fn(newPlace => Promise.resolve({ data: { add: [...places, newPlace] } })),
  };
});

beforeEach(() => {
  // silence logs
  console.log = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('App presenter', () => {
  it('is loading if loading is true', () => {
    const { container } = render(<App loading />);
    expect(container.textContent).toMatch(/loading/i);
  });

  it('displays buttons and input if loading is false', () => {
    const { container } = render(<App loading={false} />);
    expect(container.textContent).not.toMatch(/loading/i);
    expect(container.textContent).toMatch(/click a button/i);
    expect(container.textContent).toMatch(/add place/i);
  });
});

describe('AppContainer', () => {
  it('loading screen', async () => {
    const { container, getByText } = render(<AppContainer />);
    expect(container.textContent).toMatch(/loading/i);
    await waitForElement(() => getByText(/Click a button to say hello/i));
  });

  it('gets initial buttons', async () => {
    const { getByText } = render(<AppContainer />);
    await waitForElement(() => [getByText(/say hello to world/i), getByText(/say hello to mars/i)]);
  });

  it('updates main text to button value', async () => {
    const { getByText, findByText } = render(<AppContainer />);
    await waitForElement(() => getByText(/Click a button to say hello/i));
    const worldButton = await findByText(/say hello to world/i);
    fireEvent.click(worldButton);
    await waitForElement(() => getByText(/hello, world/i));
  });

  it('adding a place adds a new button', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(<AppContainer />);
    await waitForElement(() => getByText(/Click a button to say hello/i));
    const input = getByPlaceholderText(/add a new place/i);
    fireEvent.change(input, { target: { value: 'Jupiter' } });
    fireEvent.click(getByText(/add place/i));
    const jupiterButton = await findByText(/say hello to jupiter/i);
    fireEvent.click(jupiterButton);
    await waitForElement(() => getByText(/hello, jupiter/i));
  });

  it('add place button is disabled if place already exists', async () => {
    const { getByPlaceholderText, getByText } = render(<AppContainer />);
    await waitForElement(() => getByText(/Click a button to say hello/i));
    const input = getByPlaceholderText(/add a new place/i);
    const addButton = getByText(/add place/i);
    expect(input.value).toBe('');
    expect(addButton.disabled).toBe(true);
    expect(getByText(/say hello to world/i)).toBeTruthy();
    fireEvent.change(input, { target: { value: 'Worl' } });
    expect(addButton.disabled).toBe(false);
    fireEvent.change(input, { target: { value: 'World' } });
    expect(addButton.disabled).toBe(true);
  });
});

describe('useAsyncState', () => {
  const Comp = ({ children }) => children({ ...useAsyncState() });

  it('gets places on mount', () => {
    let loading;
    let places;
    render(<Comp>{value => ({ loading, places } = value) && null}</Comp>);
    expect(loading).toBe(true);
    expect(places).toEqual([]);
    return wait(() => {
      expect(loading).toBe(false);
      expect(places).toEqual(['World', 'Mars']);
    });
  });

  it('updates helloTarget when sayHello is called', () => {
    let helloTarget;
    let onSayHello;
    let loading;
    render(<Comp>{value => ({ loading, helloTarget, onSayHello } = value) && null}</Comp>);
    expect(helloTarget).toBe('');
    act(() => onSayHello('Mars'));
    return wait(() => {
      expect(helloTarget).toBe('Mars');
    });
  });
});
