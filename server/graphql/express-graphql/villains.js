/* eslint-disable max-classes-per-file */
import data from '../data';
import { makeMovie } from './movies';
import { matchName, getRandom } from '../../utils';

export const villainSchema = `
  type Villain {
    "Villain's name"
    name(shouldUpperCase: Boolean): String!
    "Villain's powers"
    powers: [String!]!
    "Movies the villain has appeared in"
    movies: [Movie!]!
  }

  type Query {
    "Villains filtered by name or power"
    villains(name: String, power: String): [Villain!]!
    "Get a random villain"
    randomVillain: Villain!
  }
`;

export class Villain {
  constructor({ name, powers, movies }) {
    // When converting to DB call, maybe make call here instead?
    // this.villain = db.fetchVillain(name);
    // this.powers = this.villain.powers;
    // etc
    this._name = name;
    this.powers = powers;
    this.movies = () => movies.map(movieName => makeMovie({ name: movieName }));
  }

  name({ shouldUpperCase }) {
    return shouldUpperCase ? this._name.toUpperCase() : this._name;
  }
}

class VillainQuery {
  villains = ({ name, power }) => {
    const villains = data.villains
      .filter(v => !name || matchName(v, name))
      .filter(v => !power || v.powers.includes(power))
      .map(v => new Villain(v));

    return villains;
  };

  randomVillain = () => new Villain(getRandom(data.villains));
}

export const villainRoot = new VillainQuery();
