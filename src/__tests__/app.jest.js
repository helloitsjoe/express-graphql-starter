/* eslint-disable no-return-assign */
import React from 'react';
import { render, waitForElement, fireEvent, wait, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import AppContainer, { App, useAsyncState } from '../app';
import { addPlace } from '../fetch-service';
import AddPlace from '../add-place';

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

  it('displays error if error is true', () => {
    const { container } = render(<App loading={false} error="gah" />);
    expect(container.textContent).toMatch(/gah/i);
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
    const { getByPlaceholderText, getByText } = render(<AppContainer />);
    await waitForElement(() => getByText(/Click a button to say hello/i));
    const input = getByPlaceholderText(/add a new place/i);
    fireEvent.change(input, { target: { value: 'Jupiter' } });
    fireEvent.click(getByText(/add place/i));
    // should add button optimistically
    const jupiterButton = getByText(/say hello to jupiter/i);
    fireEvent.click(jupiterButton);
    await waitForElement(() => getByText(/hello, jupiter/i));
  });

  it('error when adding a place removes pending place, displays error', async () => {
    addPlace.mockRejectedValue(new Error('poo'));
    const { getByPlaceholderText, queryByText } = render(<AppContainer />);
    await waitForElement(() => queryByText(/Click a button to say hello/i));
    const input = getByPlaceholderText(/add a new place/i);
    fireEvent.change(input, { target: { value: 'Jupiter' } });
    fireEvent.click(queryByText(/add place/i));
    // should add button optimistically
    expect(queryByText(/say hello to jupiter/i)).toBeTruthy();
    await wait(() => {
      expect(queryByText(/say hello to jupiter/i)).toBeNull();
      expect(queryByText(/poo/i)).toBeTruthy();
    });
  });

  it('changing input value clears addPlaceError', async () => {
    const { container, findByPlaceholderText } = render(<AppContainer addPlaceError="poo" />);
    const input = await findByPlaceholderText(/add a new place/i);
    expect(container.textContent).toMatch(/poo/i);
    fireEvent.change(input, { target: { value: 'nuts' } });
    expect(container.textContent).not.toMatch(/poo/i);
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

describe('AddPlace', () => {
  it('displays error if provided', () => {
    const { container } = render(<AddPlace error="poo" />);
    expect(container.textContent).toMatch(/poo/i);
  });
});

describe('useAsyncState (vanilla)', () => {
  const Comp = ({ cache, children }) => children({ ...useAsyncState(null, cache) });

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
    render(<Comp>{value => ({ helloTarget, onSayHello } = value) && null}</Comp>);
    expect(helloTarget).toBe('');
    act(() => onSayHello('Mars'));
    return wait(() => {
      expect(helloTarget).toBe('Mars');
    });
  });

  it('updates helloTarget from cache if query is cached', () => {
    let helloTarget;
    let onSayHello;
    render(
      <Comp cache={new Map([['Mars', true]])}>
        {value => ({ helloTarget, onSayHello } = value) && null}
      </Comp>
    );
    expect(helloTarget).toBe('');
    act(() => onSayHello('Mars'));
    // Should synchronously change back to Mars
    expect(helloTarget).toBe('Mars');
  });
});

describe('useAsyncState (react-hooks testing library)', () => {
  it('gets places on mount', async () => {
    const { result } = renderHook(() => useAsyncState());

    expect(result.current.loading).toBe(true);
    expect(result.current.places).toEqual([]);

    await wait(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.places).toEqual(['World', 'Mars']);
    });
  });

  it('hello query', async () => {
    const { result } = renderHook(() => useAsyncState(null, new Map()));

    expect(result.current.helloTarget).toBe('');

    act(() => result.current.onSayHello('World'));
    expect(result.current.loading).toBe(true);
    return wait(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.helloTarget).toBe('World');
    });
  });

  it('updates helloTarget from cache if query is cached', () => {
    const { result } = renderHook(() => useAsyncState(null, new Map([['Mars', true]])));

    expect(result.current.helloTarget).toBe('');
    act(() => result.current.onSayHello('Mars'));
    // Should synchronously change back to Mars
    expect(result.current.loading).toBe(false);
    expect(result.current.helloTarget).toBe('Mars');
  });
});
