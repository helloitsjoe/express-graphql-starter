import { matchName } from '../utils';

// TODO: Instead of instantiating models with data, have them expose methods that take data

export const makeHero = async ({ name, data }) => {
  const [hero] = await data.fetchHeroes(name);
  return {
    name: hero.name,
    powers: hero.powers,
    movies: hero.movies,
    // movies: () => hero.movies.map(movieName => makeMovie({ name: movieName, data })),
  };
};

export class Villain {
  async init({ name, data }) {
    const [villain] = await data.fetchVillains(name);
    this.name = villain.name;
    this.powers = villain.powers;
    this.movies = villain.movies;
    // this.movies = () => villain.movies.map(movieName => makeMovie({ name: movieName, data }));
    return this;
  }
}

export const makeMovie = async ({ name, data }) => {
  const [movie] = await data.fetchMovies(name);
  console.log(`movie:`, movie);
  return {
    name: movie.name,
    heroes: movie.heroes,
    villains: movie.villains,
    // heroes: movie.heroes.map(h => makeHero({ name: h.name, data })),
    // villains: movie.villains.map(v => new Villain().init({ name: v.name, data })),
  };
};
