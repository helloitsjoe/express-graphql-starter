// TODO: Instead of instantiating models with data, have them expose methods that take data

export const makeHero = async ({ name, data }) => {
  const [hero] = await data.fetchHeroes(name);
  return {
    name: hero.name,
    powers: hero.powers,
    movies: hero.movies,
  };
};

export const makeVillain = async ({ name, data }) => {
  const [villain] = await data.fetchVillains(name);
  return {
    name: villain.name,
    powers: villain.powers,
    movies: villain.movies,
  };
};

export const makeMovie = async ({ name, data }) => {
  const [movie] = await data.fetchMovies(name);
  return {
    name: movie.name,
    heroes: movie.heroes,
    villains: movie.villains,
  };
};
