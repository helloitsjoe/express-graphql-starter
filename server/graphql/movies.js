const { movies } = require('./data');
// const { makeHero } = require('./heroes');
// const { Villain } = require('./villains');

// Note that we can use types defined in other files
const movieSchema = `
  type Movie {
    name: String!
    heroes: [Hero!]!
    villains: [Villain!]!
  }

  type Query {
    movies(name: String, castMemberName: String): [Movie!]!
    randomMovie: Movie!
  }
`;

const getCastMembers = movie => movie.heroes.concat(movie.villains);

// class Movie {
//   constructor(name, heroes, villains) {
//     this.name = name;
//     this.heroes = heroes;
//     this.villains = villains;
//   }
// }

const makeMovie = ({ name }) => {
  const movie = movies.find(m => m.name.match(new RegExp(name, 'i')));
  return movie;
  // return {
  //   name,
  //   heroes: movie.heroes,
  //   villains: movie.villains,
  // };
};

class Query {
  movies = ({ name, castMemberName } = {}) => {
    const movieByName = name && movies.filter(m => m.name.match(new RegExp(name, 'i')));
    const movieByCastMember =
      castMemberName &&
      movies.filter(m =>
        getCastMembers(m).some(c => c.name.match(new RegExp(castMemberName, 'i')))
      );

    const finalMovies = movieByName || movieByCastMember || movies;

    return finalMovies;
  };

  randomMovie = () => {
    return movies[Math.floor(Math.random() * movies.length)];
  };
}

module.exports = {
  makeMovie,
  movieRoot: new Query(),
  movieSchema,
};
