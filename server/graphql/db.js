const DataLoader = require('dataloader');
const data = require('./mockData');
const { matchName, matchTitle } = require('../utils');

const wait = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

const makeAPI = ({ delay } = {}) => {
  const makeHero = () => {
    const fetch = (names, power) => {
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

    const nameLoader = new DataLoader(names => Promise.all(names.map(name => fetch(name))));

    return { fetch, nameLoader };
  };

  const makeVillain = () => {
    const fetch = (names, power) => {
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

    const nameLoader = new DataLoader(names => Promise.all(names.map(name => fetch(name))));

    return { fetch, nameLoader };
  };

  const makeMovie = () => {
    const fetch = (titles, castMemberName) => {
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

    const titleLoader = new DataLoader(titles => Promise.all(titles.map(title => fetch(title))));

    return { fetch, titleLoader };
  };

  return { hero: makeHero(), villain: makeVillain(), movie: makeMovie() };
};

module.exports = { makeAPI };
