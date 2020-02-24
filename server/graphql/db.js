const DataLoader = require('dataloader');
const data = require('./mockData');
const { matchName } = require('../utils');

const wait = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

const makeAPI = ({ delay } = {}) => {
  const fetchHeroes = (name, power) => {
    const byName = h => !name || matchName(h, name);
    const byPower = h => !power || h.powers.includes(power);
    return wait(delay).then(() => data.heroes.filter(byName).filter(byPower));
  };

  const fetchVillains = (name, power) => {
    const byName = h => !name || matchName(h, name);
    const byPower = h => !power || h.powers.includes(power);
    return wait(delay).then(() => data.villains.filter(byName).filter(byPower));
  };

  const fetchMovies = (name, castMemberName) => {
    const byName = m => !name || matchName(m, name);
    const byCast = m =>
      !castMemberName ||
      m.heroes.concat(m.villains).some(n => matchName({ name: n }, castMemberName));
    return wait(delay).then(() => data.movies.filter(byName).filter(byCast));
  };

  return { fetchHeroes, fetchVillains, fetchMovies };
};

const withLoaders = (api = makeAPI()) => {
  const batchHeroes = names => Promise.all(names.map(name => api.fetchHeroes(name)));
  const batchVillains = names => Promise.all(names.map(name => api.fetchVillains(name)));
  const batchMovies = names => Promise.all(names.map(name => api.fetchMovies(name)));

  return {
    ...api,
    heroLoader: new DataLoader(batchHeroes),
    villainLoader: new DataLoader(batchVillains),
    movieLoader: new DataLoader(batchMovies),
  };
};

module.exports = { makeAPI, withLoaders };
