// TODO: Make data async (DB)
import data from './data';
import { matchName } from '../utils';

export const makeHero = ({ name }) => {
  const hero = data.heroes.find(h => matchName(h, name));
  return {
    name: hero.name,
    powers: hero.powers,
    movies: () => hero.movies.map(movieName => makeMovie({ name: movieName })),
  };
};

export class Villain {
  constructor({ name }) {
    const villain = data.villains.find(v => matchName(v, name));
    this.name = villain.name;
    this.powers = villain.powers;
    this.movies = () => villain.movies.map(movieName => makeMovie({ name: movieName }));
  }
}

export const makeMovie = ({ name }) => {
  const movie = data.movies.find(m => matchName(m, name));
  return {
    name,
    heroes: movie.heroes.map(makeHero),
    villains: () => movie.villains.map(v => new Villain(v)),
  };
};
