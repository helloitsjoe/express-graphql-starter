const data = require('./mockData');
const { matchName } = require('../utils');

const wait = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

const makeDB = ({ delay } = {}) => {
  const fetchHeroes = (name, power) => {
    const byName = h => !name || matchName(h, name);
    const byPower = h => !power || h.powers.includes(power);
    return wait(delay).then(() => data.heroes.filter(byName).filter(byPower));
  };

  const fetchVillains = (name, power) => {
    const byName = h => !name || matchName(h, name);
    const byPower = h => !power || h.powers.includes(power);
    return wait(delay).then(() => data.villains.filter(byName).filter(byPower));
  };

  const fetchMovies = (name, castMemberName) => {
    const byName = m => !name || matchName(m, name);
    const byCast = m =>
      !castMemberName ||
      m.heroes.concat(m.villains).some(n => matchName({ name: n }, castMemberName));
    return wait(delay).then(() => data.movies.filter(byName).filter(byCast));
  };

  return { fetchHeroes, fetchVillains, fetchMovies };
};

module.exports = makeDB;
