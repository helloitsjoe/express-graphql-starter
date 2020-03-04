const DataStore = require('nedb');
const util = require('util');

const MOVIES = {
  RAIDERS: 'Raiders of the Lost Ark',
  TEMPLE: 'Temple of Doom',
  CRUSADE: 'The Last Crusade',
  INCREDIBLES: 'The Incredibles',
  BATMAN: 'Batman',
  DARK_KNIGHT: 'The Dark Knight Rises',
  X_MEN: 'X-Men',
};

const { RAIDERS, TEMPLE, CRUSADE, INCREDIBLES, BATMAN, X_MEN, DARK_KNIGHT } = MOVIES;

const heroes = [
  { name: 'Mr. Incredible', powers: ['strength', 'invulnerability'], movies: [INCREDIBLES] },
  { name: 'Mrs. Incredible', powers: ['stretch', 'strength'], movies: [INCREDIBLES] },
  { name: 'Dash', powers: ['speed'], movies: [INCREDIBLES] },
  { name: 'Violet', powers: ['invisibility'], movies: [INCREDIBLES] },
  {
    name: 'Jack-Jack',
    powers: ['fire', 'transformation', 'teleportation', 'strength', 'stretch'],
    movies: [INCREDIBLES],
  },
  {
    name: 'Indiana Jones',
    powers: ['whip', 'intelligence'],
    movies: [RAIDERS, TEMPLE, CRUSADE],
  },
  { name: 'Batman', powers: ['technology'], movies: [BATMAN, DARK_KNIGHT] },
  { name: 'Wolverine', powers: ['adamantium', 'healing'], movies: [X_MEN] },
];

const villains = [
  { name: 'Bane', powers: ['strength', 'invulnerability'], movies: [DARK_KNIGHT] },
  { name: 'The Joker', powers: ['psychology', 'chaos'], movies: [BATMAN] },
  { name: 'Magneto', powers: ['magnetism'], movies: [X_MEN] },
  { name: 'Syndrome', powers: ['technology'], movies: [INCREDIBLES] },
  { name: 'Nazis', powers: ['facism'], movies: [RAIDERS, CRUSADE] },
  { name: 'Mola Ram', powers: ['dark magic', 'brainwashing'], movies: [TEMPLE] },
];

const createMovie = title => {
  const isInMovie = character => character.movies.includes(title);
  return {
    title,
    heroes: heroes.filter(isInMovie).map(h => h.name),
    villains: villains.filter(isInMovie).map(v => v.name),
  };
};

const movies = Object.values(MOVIES).map(createMovie);

const heroDB = new DataStore();
const villainDB = new DataStore();
const movieDB = new DataStore();

heroDB.insert(heroes);
villainDB.insert(villains);
movieDB.insert(movies);

const pfy = (db, method) => util.promisify(db[method].bind(db));

const wait = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

// delay for showing DataLoader's effect
module.exports = ({ delay } = {}) => ({
  heroes: {
    find: ({ power }) => {
      const search = power ? { power: { $regex: new RegExp(power, 'i') } } : {};
      return wait(delay).then(() => pfy(heroDB, 'find')(search));
    },
    findOne: ({ names }) =>
      wait(delay).then(() => {
        const search = { name: { $regex: new RegExp(names.join('|'), 'i') } };
        return pfy(heroDB, 'find')(search).then(foundHeroes => {
          // Put heroes back in order because 'find' compares against regex
          return names.reduce((acc, name) => {
            foundHeroes.forEach(hero => {
              if (hero.name.match(new RegExp(name, 'i'))) {
                acc.push(hero);
              }
            });
            return acc;
          }, []);
        });
      }),
  },
  villains: {
    find: ({ name, power }) => {
      const search = {
        ...(name && { name: { $regex: new RegExp(name, 'i') } }),
        ...(power && { power: { $regex: new RegExp(power, 'i') } }),
      };
      return wait(delay).then(() => pfy(villainDB, 'find')(search));
    },
  },
  movies: {
    find: ({ title, castMemberName }) =>
      wait(delay).then(() => {
        if (title) {
          return pfy(movieDB, 'find')({ title: { $regex: new RegExp(title, 'i') } });
        }
        if (castMemberName) {
          return pfy(movieDB, 'find')({
            $where() {
              return this.heroes
                .concat(this.villains)
                .some(name => name.match(new RegExp(castMemberName, 'i')));
            },
          });
        }
        return pfy(movieDB, 'find')({});
      }),
  },
});
