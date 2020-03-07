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

const heroes = [
  {
    id: 1,
    name: 'Indiana Jones',
    powers: ['whip', 'intelligence'],
    movies: [RAIDERS, TEMPLE, CRUSADE],
  },
  { id: 2, name: 'Batman', powers: ['technology'], movies: [BATMAN, DARK_KNIGHT] },
  { id: 3, name: 'Mr. Incredible', powers: ['strength', 'invulnerability'], movies: [INCREDIBLES] },
  { id: 4, name: 'Mrs. Incredible', powers: ['stretch', 'strength'], movies: [INCREDIBLES] },
  { id: 5, name: 'Dash', powers: ['speed'], movies: [INCREDIBLES] },
  { id: 6, name: 'Violet', powers: ['invisibility'], movies: [INCREDIBLES] },
  {
    id: 7,
    name: 'Jack-Jack',
    powers: ['fire', 'transformation', 'teleportation', 'strength', 'stretch'],
    movies: [INCREDIBLES],
  },
  { id: 8, name: 'Wolverine', powers: ['adamantium', 'healing'], movies: [X_MEN] },
];

const villains = [
  { id: 9, name: 'Magneto', powers: ['magnetism'], movies: [X_MEN] },
  { id: 10, name: 'Bane', powers: ['strength', 'invulnerability'], movies: [DARK_KNIGHT] },
  { id: 11, name: 'The Joker', powers: ['psychology', 'chaos'], movies: [BATMAN] },
  { id: 12, name: 'Syndrome', powers: ['technology'], movies: [INCREDIBLES] },
  { id: 13, name: 'Nazis', powers: ['facism'], movies: [RAIDERS, CRUSADE] },
  { id: 14, name: 'Mola Ram', powers: ['dark magic', 'brainwashing'], movies: [TEMPLE] },
];

let currentId = 15;

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
