const DataLoader = require('dataloader');
const DataStore = require('nedb');
const util = require('util');
const { heroes, villains, movies } = require('./mockData');

const defaultHeroDB = new DataStore();
const defaultVillainDB = new DataStore();
const defaultMovieDB = new DataStore();

defaultHeroDB.insert(heroes);
defaultVillainDB.insert(villains);
defaultMovieDB.insert(movies);

const wait = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

const sortByIdOrder = (ids, foundCharacters) => {
  return ids.reduce((acc, id) => {
    foundCharacters.forEach(foundCharacter => {
      if (id === foundCharacter.id) {
        acc.push(foundCharacter);
      }
    });
    return acc;
  }, []);
};

const makeAPI = ({
  heroDB = defaultHeroDB,
  villainDB = defaultVillainDB,
  movieDB = defaultMovieDB,
  delay,
} = {}) => {
  // TODO: remove empty object as default arg
  const makeHero = () => {
    const find = util.promisify(heroDB.find.bind(heroDB));
    const findOne = util.promisify(heroDB.findOne.bind(heroDB));

    const fetchByName = name =>
      wait(delay).then(() => findOne({ name: { $regex: new RegExp(name, 'i') } }));

    const fetchByIds = ids => {
      return wait(delay)
        .then(() => find({ id: { $in: ids } }))
        .then(foundHeroes => sortByIdOrder(ids, foundHeroes));
    };
    const fetchAll = power => {
      const search = power ? { power: { $regex: new RegExp(power, 'i') } } : {};
      return wait(delay).then(() => find(search));
    };

    const nameLoader = new DataLoader(names => Promise.all(names.map(fetchByName)));

    return { fetchByName, fetchByIds, fetchAll, nameLoader };
  };

  const makeVillain = () => {
    const find = util.promisify(villainDB.find.bind(villainDB));
    const findOne = util.promisify(villainDB.findOne.bind(villainDB));

    const fetchByName = name =>
      wait(delay).then(() => findOne({ name: { $regex: new RegExp(name, 'i') } }));

    const fetchByIds = ids => {
      return wait(delay)
        .then(() => find({ id: { $in: ids } }))
        .then(foundVillains => sortByIdOrder(ids, foundVillains));
    };

    const fetchAll = power => {
      const search = power ? { power: { $regex: new RegExp(power, 'i') } } : {};
      return wait(delay).then(() => find(search));
    };

    const nameLoader = new DataLoader(names => Promise.all(names.map(fetchByName)));

    return { fetchByName, fetchByIds, fetchAll, nameLoader };
  };

  // TODO: Convert like hero
  const makeMovie = () => {
    const dbFind = util.promisify(movieDB.find.bind(movieDB));

    // TODO: Consolidate find and fetch
    const find = ({ title, castMemberName }) =>
      wait(delay).then(() => {
        if (title) {
          return dbFind({ title: { $regex: new RegExp(title, 'i') } });
        }
        if (castMemberName) {
          return dbFind({
            $where() {
              return this.heroes
                .concat(this.villains)
                .some(name => name.match(new RegExp(castMemberName, 'i')));
            },
          });
        }
        return dbFind({});
      });

    const fetch = (titles, castMemberName) => {
      if (titles) {
        const titlesArray = [].concat(titles);
        const titlesPromises = titlesArray.map(title => find({ title }));
        return Promise.all(titlesPromises).then(ea => ea.flat());
      }
      if (castMemberName) {
        return find({ castMemberName });
      }
      return find({});
    };

    const titleLoader = new DataLoader(titles => Promise.all(titles.map(title => fetch(title))));

    return { fetch, titleLoader };
  };

  return { hero: makeHero(), villain: makeVillain(), movie: makeMovie() };
};

module.exports = { makeAPI };
