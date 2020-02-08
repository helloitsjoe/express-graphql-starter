import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLBoolean } from 'graphql';
import { heroes } from '../data';
import { MovieType, makeMovie } from './movies';
import { getRandom } from '../../utils';

export const makeHero = ({ name, powers, movies }) => {
  return {
    powers,
    name,
    movies: () => movies.map(movieName => makeMovie({ name: movieName })),
  };
};

export const HeroType = new GraphQLObjectType({
  name: 'Hero',
  fields: () => ({
    name: {
      type: GraphQLString,
      args: { shouldUppercase: { type: GraphQLBoolean } },
      resolve({ name }, { shouldUppercase }) {
        return shouldUppercase ? name.toUpperCase() : name;
      },
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

      return finalHeroes.map(makeHero);
    },
  },
  randomHero: {
    type: HeroType,
    resolve() {
      return getRandom(heroes);
    },
  },
};
