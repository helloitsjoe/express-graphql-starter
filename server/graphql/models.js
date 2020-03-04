export const makeHero = async ({ name, db }) => {
  const hero = await db.hero.nameLoader.load(name);
  return {
    name: hero.name,
    powers: hero.powers,
    movies: hero.movies,
  };
};

export const makeVillain = async ({ name, db }) => {
  const [villain] = await db.villain.nameLoader.load(name);
  return {
    name: villain.name,
    powers: villain.powers,
    movies: villain.movies,
  };
};

export const makeMovie = async ({ title, db }) => {
  const [movie] = await db.movie.titleLoader.load(title);
  return {
    title: movie.title,
    heroes: movie.heroes,
    villains: movie.villains,
  };
};
