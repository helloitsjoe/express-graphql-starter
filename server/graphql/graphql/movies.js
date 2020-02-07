import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { movies } from '../data';
import { VillainType } from './villains';
import { HeroType, makeHero } from './heroes';

const getCastMembers = movie => movie.heroes.concat(movie.villains);

export const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    name: { type: GraphQLString },
    heroes: { type: new GraphQLList(HeroType) },
    villains: { type: new GraphQLList(VillainType) },
  }),
});

export const movieFields = {
  movies: {
    type: new GraphQLList(MovieType),
    args: {
      name: { type: GraphQLString },
      castMemberName: { type: GraphQLString },
    },
    resolve(_, { name, castMemberName }) {
      const movieByName = name && movies.filter(m => m.name.match(new RegExp(name, 'i')));
      const movieByCastMember =
        castMemberName &&
        movies.filter(m =>
          getCastMembers(m).some(c => c.name.match(new RegExp(castMemberName, 'i')))
        );

      const finalMovies = movieByName || movieByCastMember || movies;

      // return finalMovies.map(makeMovie);
      return finalMovies;
    },
  },
  randomMovie: {
    type: MovieType,
  },
};

// Note that we can use types defined in other files
// export const movieSchema = `
//   type Movie {
//     name: String!
//     heroes: [Hero!]!
//     villains: [Villain!]!
//   }

//   type Query {
//     movies(name: String, castMemberName: String): [Movie!]!
//     randomMovie: Movie!
//   }
// `;

// const getCastMembers = movie => movie.heroes.concat(movie.villains);

// export const makeMovie = ({ name }) => {
//   const movie = movies.find(m => m.name.match(new RegExp(name, 'i')));
//   return {
//     name: () => movie.name,
//     heroes: () => movie.heroes.map(makeHero),
//     villains: () => movie.villains.map(v => new Villain(v)),
//   };
// };

// export class Query {
//   movies = ({ name, castMemberName } = {}) => {
//     const movieByName = name && movies.filter(m => m.name.match(new RegExp(name, 'i')));
//     const movieByCastMember =
//       castMemberName &&
//       movies.filter(m =>
//         getCastMembers(m).some(c => c.name.match(new RegExp(castMemberName, 'i')))
//       );

//     const finalMovies = movieByName || movieByCastMember || movies;

//     return finalMovies.map(makeMovie);
//   };

//   randomMovie = () => {
//     return movies[Math.floor(Math.random() * movies.length)];
//   };
// }

// export const movieRoot = new Query();
