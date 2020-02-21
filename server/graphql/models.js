// TODO: Instead of instantiating models with data, have them expose methods that take data

export const makeHero = async ({ name, db }) => {
  const [hero] = await db.fetchHeroes(name);
  return {
    name: hero.name,
    powers: hero.powers,
    movies: hero.movies,
  };
};

export const makeVillain = async ({ name, db }) => {
  const [villain] = await db.fetchVillains(name);
  return {
    name: villain.name,
    powers: villain.powers,
    movies: villain.movies,
  };
};

export const makeMovie = async ({ name, db }) => {
  const [movie] = await db.fetchMovies(name);
  return {
    name: movie.name,
    heroes: movie.heroes,
    villains: movie.villains,
  };
};
