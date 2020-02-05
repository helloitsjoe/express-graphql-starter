const { heroes } = require('./data');
const { makeMovie } = require('./movies');

const heroSchema = `
  type Hero {
    name(shouldUppercase: Boolean): String!
    powers: [String!]!
    movies: [Movie!]!
  }

  type Query {
    heroes(name: String, power: String): [Hero!]!
    randomHero: Hero!
  }
`;

const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];

const makeHero = ({ name, powers, movies }) => {
  return {
    // Note: This works, but you can't unit test this resolver anymore
    // because hero.name returns a function instead of a value
    name({ shouldUppercase = false }) {
      return shouldUppercase ? name.toUpperCase() : name;
    },
    powers,
    movies: movies.map(makeMovie),
  };
};

const heroesResolver = ({ name, power } = {}) => {
  const heroesByName = name && heroes.filter(h => h.name.match(new RegExp(name, 'i')));
  const heroesByPower = power && heroes.filter(h => h.powers.includes(power));

  const finalHeroes = heroesByName || heroesByPower || heroes;

  return finalHeroes.map(makeHero);
};

const heroRootObject = {
  heroes: heroesResolver,
  randomHero: () => getRandom(heroesResolver()),
};

module.exports = {
  // makeHero,
  heroRootObject,
  heroSchema,
};
