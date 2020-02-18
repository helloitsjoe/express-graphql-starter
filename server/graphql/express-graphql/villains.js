// NOTE: graphql's `buildSchema` is very limited. Currently you can't
// define resolvers for individual types, so you can't do deep queries
// i.e. Hero -> Movie -> Hero... graphql-tools `makeExecutableSchema`
// is a better solution.

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

  extend type Query {
    "Villains filtered by name or power"
    villains(name: String, power: String): [Villain!]!
    "Get a random villain"
    randomVillain: Villain!
  }
`;

export class VillainType {
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
    return villains.map(v => new VillainType(v));
  };

  randomVillain = async (args, { data }) => {
    const villains = await data.fetchVillains();
    return new VillainType(getRandom(villains));
  };
}

export const villainRoot = new VillainQuery();
