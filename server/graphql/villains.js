/* eslint-disable max-classes-per-file */
const { villains } = require('./data');
const { makeMovie } = require('./movies');

const villainSchema = `
  type Villain {
    name(shouldUpperCase: Boolean): String!
    powers: [String!]!
    movies: [Movie!]!
  }

  type Query {
    villains(name: String, power: String): [Villain!]!
    randomVillain: Villain!
  }
`;

class Villain {
  constructor({ name, powers, movies }) {
    // When converting to DB call, maybe make call here instead?
    // this.villain = db.fetchVillain(name);
    // this.powers = this.villain.powers;
    // etc
    this._name = name;
    this.powers = powers;
    this.movies = movies.map(makeMovie);
  }

  name = ({ shouldUpperCase }) => (shouldUpperCase ? this._name.toUpperCase() : this._name);
}

class VillainQuery {
  villains = ({ name, power }) => {
    const byName = name && villains.filter(v => v.name.match(new RegExp(name, 'i')));
    const byPower = power && villains.filter(v => v.powers.includes(power));

    const finalVillains = byName || byPower || villains;

    return finalVillains.map(v => new Villain(v));
  };

  randomVillain = () => new Villain(villains[Math.floor(Math.random() * villains.length)]);
}

const villainRoot = new VillainQuery();

module.exports = {
  // Villain,
  villainRoot,
  villainSchema,
};
