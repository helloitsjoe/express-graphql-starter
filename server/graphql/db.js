const DataLoader = require('dataloader');
const makeData = require('./mockData');

const makeAPI = (db = makeData()) => {
  const makeHero = () => {
    const fetch = (names, power) => {
      if (names) {
        const namesArray = [].concat(names);
        const namesPromises = namesArray.map(name => db.heroes.find({ name }));
        return Promise.all(namesPromises).then(ea => ea.flat());
      }
      // TODO: Reduce this duplication here and in db
      return power ? db.heroes.find({ power }) : db.heroes.find({});
    };

    const nameLoader = new DataLoader(names => Promise.all(names.map(name => fetch(name))));

    return { fetch, nameLoader };
  };

  const makeVillain = () => {
    const fetch = (names, power) => {
      if (names) {
        const namesArray = [].concat(names);
        const namesPromises = namesArray.map(name => db.villains.find({ name }));
        return Promise.all(namesPromises).then(ea => ea.flat());
      }
      // TODO: Reduce this duplication here and in db
      return power ? db.villains.find({ power }) : db.villains.find({});
    };

    const nameLoader = new DataLoader(names => Promise.all(names.map(name => fetch(name))));

    return { fetch, nameLoader };
  };

  const makeMovie = () => {
    const fetch = (titles, castMemberName) => {
      if (titles) {
        const titlesArray = [].concat(titles);
        const titlesPromises = titlesArray.map(title => db.movies.find({ title }));
        return Promise.all(titlesPromises).then(ea => ea.flat());
      }
      if (castMemberName) {
        return db.movies.find({ castMemberName });
      }
      return db.movies.find({});
    };

    const titleLoader = new DataLoader(titles => Promise.all(titles.map(title => fetch(title))));

    return { fetch, titleLoader };
  };

  return { hero: makeHero(), villain: makeVillain(), movie: makeMovie() };
};

module.exports = { makeAPI };
