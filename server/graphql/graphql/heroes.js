import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean } from 'graphql';
import { heroes } from '../data';
import { MovieType } from './movies';
import { getRandom } from '../../utils';

// When is fields an object vs a function?
export const HeroType = new GraphQLObjectType({
  name: 'Hero',
  fields: () => ({
    name: {
      type: GraphQLString,
      args: { shouldUppercase: { type: GraphQLBoolean } },
    },
    powers: { type: new GraphQLList(GraphQLString) },
    movies: { type: new GraphQLList(MovieType) },
  }),
});

export const heroFields = {
  heroes: {
    type: new GraphQLList(HeroType),
    args: {
      name: { type: GraphQLString },
      power: { type: new GraphQLList(GraphQLString) },
    },
    resolve(obj, { name, power }) {
      const heroesByName = name && heroes.filter(h => h.name.match(new RegExp(name, 'i')));
      const heroesByPower = power && heroes.filter(h => h.powers.includes(power));

      const finalHeroes = heroesByName || heroesByPower || heroes;

      // return finalHeroes.map(makeHero);
      return finalHeroes;
    },
  },
  randomHero: {
    type: HeroType,
    resolver() {
      return getRandom(heroes);
    },
  },
};

// export const heroSchema = `
//   type Hero {
//     name(shouldUppercase: Boolean): String!
//     powers: [String!]!
//     movies: [Movie!]!
//   }

//   type Query {
//     heroes(name: String, power: String): [Hero!]!
//     randomHero: Hero!
//   }
// `;

// export const makeHero = ({ name, powers, movies }) => {
//   return {
//     powers,
//     name: ({ shouldUppercase = false }) => (shouldUppercase ? name.toUpperCase() : name),
//     movies: () => movies.map(movieName => makeMovie({ name: movieName })),
//   };
// };

// const heroesResolver = ({ name, power } = {}) => {
//   const heroesByName = name && heroes.filter(h => h.name.match(new RegExp(name, 'i')));
//   const heroesByPower = power && heroes.filter(h => h.powers.includes(power));

//   const finalHeroes = heroesByName || heroesByPower || heroes;

//   return finalHeroes.map(makeHero);
// };

// export const heroRootObject = {
//   heroes: heroesResolver,
//   randomHero: () => getRandom(heroesResolver()),
// };
