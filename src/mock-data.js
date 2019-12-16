import { PLACES_QUERY, HELLO_QUERY, ADD_PLACE } from './queries';

export const places = [{ name: 'World' }, { name: 'Mars' }];

export const mockPlaces = {
  request: { query: PLACES_QUERY, variables: {} },
  result: { data: { places } },
};

export const mockHello = placeName => ({
  request: { query: HELLO_QUERY, variables: { placeName } },
  result: jest.fn(() => ({ data: { place: { name: placeName } } })),
});

export const mockAdd = {
  request: { query: ADD_PLACE, variables: { placeName: 'Jupiter' } },
  result: { data: { add: { name: places.concat({ name: 'Jupiter' }) } } },
};

export const mockAddError = {
  request: { query: ADD_PLACE, variables: { placeName: 'Jupiter' } },
  error: new Error('phoooooooey'),
};
