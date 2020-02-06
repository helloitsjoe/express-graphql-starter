/* eslint-disable no-return-assign */
import React from 'react';
import { configure, render, waitForElement, fireEvent, wait } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import AppContainer, { App, useAsyncState, STATUS } from '../app';
import { addPlanet } from '../fetch-service';
import AddPlanet from '../add-planet';

configure({ asyncUtilTimeout: 100 });

const origError = console.error;
console.error = (...args) => {
  if (args[0].match(/wrong act()|was not wrapped/)) {
    return;
  }
  origError(...args);
};

jest.mock('../fetch-service', () => {
  const planets = ['World', 'Mars'];
  return {
    sayHello: jest.fn(planet => Promise.resolve({ data: { planet } })),
    getPlanets: jest.fn().mockResolvedValue({ data: { planets } }),
    addPlanet: jest.fn(newPlanet => Promise.resolve({ data: { add: [...planets, newPlanet] } })),
  };
});

beforeEach(() => {
  // silence logs
  console.log = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

xdescribe('App', () => {
  describe('App presenter', () => {
    it('is loading if status is LOADING', () => {
      const { container } = render(<App status={STATUS.LOADING} />);
      expect(container.textContent).toMatch(/loading/i);
    });

    it('displays error if status is ERROR', () => {
      const { container } = render(<App status={STATUS.ERROR} error="gah" />);
      expect(container.textContent).toMatch(/gah/i);
    });

    it('displays buttons and input if status is IDLE', () => {
      const { container } = render(<App status={STATUS.IDLE} />);
      expect(container.textContent).not.toMatch(/loading/i);
      expect(container.textContent).toMatch(/click a button/i);
      expect(container.textContent).toMatch(/add planet/i);
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
      await waitForElement(() => [
        getByText(/say hello to world/i),
        getByText(/say hello to mars/i),
      ]);
    });

    it('updates main text to button value', async () => {
      const { getByText, findByText } = render(<AppContainer />);
      await waitForElement(() => getByText(/Click a button to say hello/i));
      const worldButton = await findByText(/say hello to world/i);
      fireEvent.click(worldButton);
      await waitForElement(() => getByText(/hello, world/i));
    });

    it('adding a planet adds a new button', async () => {
      const { getByPlaceholderText, getByText } = render(<AppContainer />);
      await waitForElement(() => getByText(/Click a button to say hello/i));
      const input = getByPlaceholderText(/add a new planet/i);
      fireEvent.change(input, { target: { value: 'Jupiter' } });
      fireEvent.click(getByText(/add planet/i));
      // should add button optimistically
      const jupiterButton = getByText(/say hello to jupiter/i);
      fireEvent.click(jupiterButton);
      await waitForElement(() => getByText(/hello, jupiter/i));
    });

    it('error when adding a planet removes pending planet, displays error', async () => {
      addPlanet.mockRejectedValue(new Error('poo'));
      const { getByPlaceholderText, queryByText } = render(<AppContainer />);
      await waitForElement(() => queryByText(/Click a button to say hello/i));
      const input = getByPlaceholderText(/add a new planet/i);
      fireEvent.change(input, { target: { value: 'Jupiter' } });
      fireEvent.click(queryByText(/add planet/i));
      // should add button optimistically
      expect(queryByText(/say hello to jupiter/i)).toBeTruthy();
      await wait(() => {
        expect(queryByText(/say hello to jupiter/i)).toBeNull();
        expect(queryByText(/poo/i)).toBeTruthy();
      });
    });

    it('changing input value clears addPlanetError', async () => {
      const { container, findByPlaceholderText } = render(<AppContainer addPlanetError="poo" />);
      const input = await findByPlaceholderText(/add a new planet/i);
      expect(container.textContent).toMatch(/poo/i);
      fireEvent.change(input, { target: { value: 'nuts' } });
      expect(container.textContent).not.toMatch(/poo/i);
    });

    it('add planet button is disabled if planet already exists', async () => {
      const { getByPlaceholderText, getByText } = render(<AppContainer />);
      await waitForElement(() => getByText(/Click a button to say hello/i));
      const input = getByPlaceholderText(/add a new planet/i);
      const addButton = getByText(/add planet/i);
      expect(input.value).toBe('');
      expect(addButton.disabled).toBe(true);
      expect(getByText(/say hello to world/i)).toBeTruthy();
      fireEvent.change(input, { target: { value: 'Worl' } });
      expect(addButton.disabled).toBe(false);
      fireEvent.change(input, { target: { value: 'World' } });
      expect(addButton.disabled).toBe(true);
    });
  });

  describe('AddPlanet', () => {
    it('displays error if provided', () => {
      const { container } = render(<AddPlanet error="poo" />);
      expect(container.textContent).toMatch(/poo/i);
    });
  });

  xdescribe('useAsyncState (vanilla)', () => {
    const Comp = ({ cache, children }) => children({ ...useAsyncState(null, cache) });

    it('gets planets on mount', () => {
      let loading;
      let planets;
      render(<Comp>{value => ({ loading, planets } = value) && null}</Comp>);
      expect(loading).toBe(true);
      expect(planets).toEqual([]);
      return wait(() => {
        expect(loading).toBe(false);
        expect(planets).toEqual(['World', 'Mars']);
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
    it('gets planets on mount', async () => {
      const { result } = renderHook(() => useAsyncState());

      expect(result.current.status).toBe(STATUS.LOADING);
      expect(result.current.planets).toEqual([]);

      await wait(() => {
        expect(result.current.status).toBe(STATUS.IDLE);
        expect(result.current.planets).toEqual(['World', 'Mars']);
      });
    });

    it('hello query', async () => {
      const { result } = renderHook(() => useAsyncState(null, new Map()));

      expect(result.current.helloTarget).toBe('');

      act(() => result.current.onSayHello('World'));
      expect(result.current.status).toBe(STATUS.LOADING);
      return wait(() => {
        expect(result.current.status).toBe(STATUS.IDLE);
        expect(result.current.helloTarget).toBe('World');
      });
    });

    it('updates helloTarget from cache if query is cached', () => {
      const { result } = renderHook(() => useAsyncState(null, new Map([['Mars', true]])));

      expect(result.current.helloTarget).toBe('');
      act(() => result.current.onSayHello('Mars'));
      // Should synchronously change back to Mars
      expect(result.current.status).toBe(STATUS.IDLE);
      expect(result.current.helloTarget).toBe('Mars');
    });
  });
});
