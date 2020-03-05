const MOVIES = {
  RAIDERS: 'Raiders of the Lost Ark',
  TEMPLE: 'Temple of Doom',
  CRUSADE: 'The Last Crusade',
  INCREDIBLES: 'The Incredibles',
  BATMAN: 'Batman',
  DARK_KNIGHT: 'The Dark Knight Rises',
  X_MEN: 'X-Men',
};

const { RAIDERS, TEMPLE, CRUSADE, INCREDIBLES, BATMAN, X_MEN, DARK_KNIGHT } = MOVIES;

let currentId = 1;

const heroes = [
  {
    name: 'Indiana Jones',
    powers: ['whip', 'intelligence'],
    movies: [RAIDERS, TEMPLE, CRUSADE],
  },
  { name: 'Batman', powers: ['technology'], movies: [BATMAN, DARK_KNIGHT] },
  { name: 'Mr. Incredible', powers: ['strength', 'invulnerability'], movies: [INCREDIBLES] },
  { name: 'Mrs. Incredible', powers: ['stretch', 'strength'], movies: [INCREDIBLES] },
  { name: 'Dash', powers: ['speed'], movies: [INCREDIBLES] },
  { name: 'Violet', powers: ['invisibility'], movies: [INCREDIBLES] },
  {
    name: 'Jack-Jack',
    powers: ['fire', 'transformation', 'teleportation', 'strength', 'stretch'],
    movies: [INCREDIBLES],
  },
  { name: 'Wolverine', powers: ['adamantium', 'healing'], movies: [X_MEN] },
].map(ea => ({ ...ea, id: currentId++ }));

const villains = [
  { name: 'Magneto', powers: ['magnetism'], movies: [X_MEN] },
  { name: 'Bane', powers: ['strength', 'invulnerability'], movies: [DARK_KNIGHT] },
  { name: 'The Joker', powers: ['psychology', 'chaos'], movies: [BATMAN] },
  { name: 'Syndrome', powers: ['technology'], movies: [INCREDIBLES] },
  { name: 'Nazis', powers: ['facism'], movies: [RAIDERS, CRUSADE] },
  { name: 'Mola Ram', powers: ['dark magic', 'brainwashing'], movies: [TEMPLE] },
].map(ea => ({ ...ea, id: currentId++ }));

const createMovie = title => {
  const isInMovie = character => character.movies.includes(title);
  return {
    title,
    heroes: heroes.filter(isInMovie).map(h => h.name),
    villains: villains.filter(isInMovie).map(v => v.name),
    id: currentId++,
  };
};

const movies = Object.values(MOVIES).map(createMovie);

module.exports = { heroes, villains, movies };
