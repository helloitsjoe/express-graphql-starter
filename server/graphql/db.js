const DataLoader = require('dataloader');
const data = require('./mockData');
const { matchName, matchTitle } = require('../utils');

const wait = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

const makeAPI = ({ delay } = {}) => {
  const fetchHeroes = (names, power) => {
    if (names) {
      const namesArray = [].concat(names);
      const namesPromises = namesArray.map(name =>
        wait(delay).then(() => data.heroes.find(h => matchName(h, name)))
      );
      return Promise.all(namesPromises);
    }
    return wait(delay).then(() => {
      return power ? data.heroes.filter(h => h.powers.includes(power)) : data.heroes;
    });
  };

  const fetchVillains = (name, power) => {
    const byName = h => !name || matchName(h, name);
    const byPower = h => !power || h.powers.includes(power);
    return wait(delay).then(() => data.villains.filter(byName).filter(byPower));
  };

  const fetchMovies = (title, castMemberName) => {
    const byTitle = m => !title || matchTitle(m, title);
    const byCast = m =>
      !castMemberName ||
      m.heroes.concat(m.villains).some(n => matchName({ name: n }, castMemberName));
    return wait(delay).then(() => data.movies.filter(byTitle).filter(byCast));
  };

  return { fetchHeroes, fetchVillains, fetchMovies };
};

const withLoaders = (api = makeAPI()) => {
  const batchHeroes = names => Promise.all(names.map(name => api.fetchHeroes(name)));
  const batchVillains = names => Promise.all(names.map(name => api.fetchVillains(name)));
  const batchMovies = titles => Promise.all(titles.map(title => api.fetchMovies(title)));

  return {
    ...api,
    heroLoader: new DataLoader(batchHeroes),
    villainLoader: new DataLoader(batchVillains),
    movieLoader: new DataLoader(batchMovies),
  };
};

module.exports = { makeAPI, withLoaders };
