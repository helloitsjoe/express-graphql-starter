/* eslint-disable max-classes-per-file */
import { makeMovie } from '../models';
import { getRandom } from '../../utils';

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
    this._name = name;
    this.powers = powers;
    this.movies = (args, { data }) => movies.map(movieName => makeMovie({ name: movieName, data }));
  }

  name({ shouldUpperCase }) {
    return shouldUpperCase ? this._name.toUpperCase() : this._name;
  }
}

class VillainQuery {
  villains = async ({ name, power }, { data }) => {
    const villains = await data.fetchVillains(name, power);
    return villains.map(v => new Villain(v));
  };

  randomVillain = async (args, { data }) => {
    const villains = await data.fetchVillains();
    return new Villain(getRandom(villains));
  };
}

export const villainRoot = new VillainQuery();
