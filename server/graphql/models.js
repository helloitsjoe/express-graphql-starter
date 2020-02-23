export const makeHero = async ({ name, db }) => {
  const [hero] = await db.heroLoader.load(name);
  return {
    name: hero.name,
    powers: hero.powers,
    movies: hero.movies,
  };
};

export const makeVillain = async ({ name, db }) => {
  const [villain] = await db.villainLoader.load(name);
  return {
    name: villain.name,
    powers: villain.powers,
    movies: villain.movies,
  };
};

export const makeMovie = async ({ name, db }) => {
  const [movie] = await db.movieLoader.load(name);
  return {
    name: movie.name,
    heroes: movie.heroes,
    villains: movie.villains,
  };
};
