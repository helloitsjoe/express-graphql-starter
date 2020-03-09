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

    const fetchByName = name => findOne({ name: { $regex: new RegExp(name, 'i') } });
    const fetchByIds = ids => {
      return wait(delay)
        .then(() => find({ id: { $in: ids } }))
        .then(foundHeroes => {
          return ids.reduce((acc, id) => {
            foundHeroes.forEach(foundHero => {
              if (id === foundHero.id) {
                acc.push(foundHero);
              }
            });
            return acc;
          }, []);
        });
    };
    const fetchAll = power => {
      const search = power ? { power: { $regex: new RegExp(power, 'i') } } : {};
      return wait(delay).then(() => find(search));
    };

    const nameLoader = new DataLoader(names => Promise.all(names.map(fetchByName)));

    return { fetchByName, fetchByIds, fetchAll, nameLoader };
  };

  // TODO: Convert like hero
  const makeVillain = () => {
    const dbFind = util.promisify(villainDB.find.bind(villainDB));

    // TODO: Consolidate find and fetch
    const find = ({ name, power }) => {
      const search = {
        ...(name && { name: { $regex: new RegExp(name, 'i') } }),
        ...(power && { power: { $regex: new RegExp(power, 'i') } }),
      };
      return wait(delay).then(() => dbFind(search));
    };

    const fetch = (names, power) => {
      if (names) {
        const namesArray = [].concat(names);
        const namesPromises = namesArray.map(name => find({ name }));
        return Promise.all(namesPromises).then(ea => ea.flat());
      }
      return power ? find({ power }) : find({});
    };

    const nameLoader = new DataLoader(names => Promise.all(names.map(name => fetch(name))));

    return { fetch, nameLoader };
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
