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

  const fetchVillains = (names, power) => {
    if (names) {
      const namesArray = [].concat(names);
      const namesPromises = namesArray.map(name =>
        wait(delay).then(() => data.villains.find(v => matchName(v, name)))
      );
      return Promise.all(namesPromises);
    }
    return wait(delay).then(() => {
      return power ? data.villains.filter(v => v.powers.includes(power)) : data.villains;
    });
  };

  const fetchMovies = (titles, castMemberName) => {
    if (titles) {
      const titlesArray = [].concat(titles);
      const titlesPromises = titlesArray.map(title =>
        wait(delay).then(() => data.movies.find(m => matchTitle(m, title)))
      );
      return Promise.all(titlesPromises);
    }
    return wait(delay).then(() => {
      if (castMemberName) {
        const byCast = m =>
          m.heroes.concat(m.villains).some(name => matchName({ name }, castMemberName));
        return data.movies.filter(byCast);
      }
      return data.movies;
    });
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
