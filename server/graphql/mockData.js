const MOVIE = {
  RAIDERS: 'Raiders of the Lost Ark',
  TEMPLE: 'Temple of Doom',
  CRUSADE: 'The Last Crusade',
  INCREDIBLES: 'The Incredibles',
  BATMAN: 'Batman',
  X_MEN: 'X-Men',
};

const { RAIDERS, TEMPLE, CRUSADE, INCREDIBLES, BATMAN, X_MEN } = MOVIE;

const heroes = [
  { name: 'Mr. Incredible', powers: ['strength', 'invulnerability'], movies: [INCREDIBLES] },
  { name: 'Mrs. Incredible', powers: ['stretch', 'strength'], movies: [INCREDIBLES] },
  { name: 'Dash', powers: ['speed'], movies: [INCREDIBLES] },
  { name: 'Violet', powers: ['invisibility'], movies: [INCREDIBLES] },
  {
    name: 'Jack-Jack',
    powers: ['fire', 'transformation', 'teleportation', 'strength', 'stretch'],
    movies: [INCREDIBLES],
  },
  {
    name: 'Indiana Jones',
    powers: ['whip', 'intelligence'],
    movies: [RAIDERS, TEMPLE, CRUSADE],
  },
  { name: 'Batman', powers: ['technology'], movies: [BATMAN] },
  { name: 'Wolverine', powers: ['adamantium', 'healing'], movies: [X_MEN] },
];

const villains = [
  { name: 'Bane', powers: ['strength', 'invulnerability'], movies: [BATMAN] },
  { name: 'The Joker', powers: ['psychology', 'chaos'], movies: [BATMAN] },
  { name: 'Magneto', powers: ['magnetism'], movies: [X_MEN] },
  { name: 'Syndrome', powers: ['technology'], movies: [INCREDIBLES] },
  { name: 'Nazis', powers: ['facism'], movies: [RAIDERS, CRUSADE] },
  { name: 'Mola Ram', powers: ['dark magic', 'brainwashing'], movies: [TEMPLE] },
];

const createMovie = title => {
  const isInMovie = character => character.movies.includes(title);
  return {
    title,
    heroes: heroes.filter(isInMovie).map(h => h.name),
    villains: villains.filter(isInMovie).map(v => v.name),
  };
};

const movies = Object.values(MOVIE).map(createMovie);

module.exports = {
  heroes,
  villains,
  movies,
};
