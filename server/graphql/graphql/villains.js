/* eslint-disable max-classes-per-file */
import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLList } from 'graphql';
import { villains } from '../data';
import { MovieType } from './movies';
import { HeroType } from './heroes';
import { getRandom } from '../../utils';

export const VillainType = new GraphQLObjectType({
  name: 'Villain',
  fields: {
    name: {
      type: GraphQLString,
      args: { shouldUpperCase: { type: GraphQLBoolean } },
      resolve({ name }, { shouldUpperCase }) {
        return shouldUpperCase ? name.toUpperCase() : name;
      },
    },
    powers: { type: new GraphQLList(GraphQLString) },
    movies: { type: new GraphQLList(MovieType) },
  },
});

export const VillainQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    villains: {
      type: new GraphQLList(VillainType),
      args: {
        name: { type: GraphQLString },
        power: { type: GraphQLString },
      },
      resolve(obj, { name, power }) {
        const byName = name && villains.filter(v => v.name.match(new RegExp(name, 'i')));
        const byPower = power && villains.filter(v => v.powers.includes(power));

        const finalVillains = byName || byPower || villains;

        // return finalVillains.map(v => new Villain(v));
        return finalVillains;
      },
    },
    randomVillain: {
      type: HeroType,
      resolver() {
        return getRandom(villains);
      },
    },
  },
});

// export const villainSchema = `
//   type Villain {
//     name(shouldUpperCase: Boolean): String!
//     powers: [String!]!
//     movies: [Movie!]!
//   }

//   type Query {
//     villains(name: String, power: String): [Villain!]!
//     randomVillain: Villain!
//   }
// `;

// export class Villain {
//   constructor({ name, powers, movies }) {
//     // When converting to DB call, maybe make call here instead?
//     // this.villain = db.fetchVillain(name);
//     // this.powers = this.villain.powers;
//     // etc
//     this._name = name;
//     this.powers = powers;
//     this.movies = () => movies.map(movieName => makeMovie({ name: movieName }));
//   }

//   name({ shouldUpperCase }) {
//     return shouldUpperCase ? this._name.toUpperCase() : this._name;
//   }
// }

// class VillainQuery {
//   villains = ({ name, power }) => {
//     const byName = name && villains.filter(v => v.name.match(new RegExp(name, 'i')));
//     const byPower = power && villains.filter(v => v.powers.includes(power));

//     const finalVillains = byName || byPower || villains;

//     return finalVillains.map(v => new Villain(v));
//   };

//   randomVillain = () => new Villain(villains[Math.floor(Math.random() * villains.length)]);
// }

// export const villainRoot = new VillainQuery();
