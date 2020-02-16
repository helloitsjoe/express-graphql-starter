/* eslint-disable import/prefer-default-export */
import { GraphQLString, GraphQLList } from 'graphql';

const initialPlanets = ['World', 'Mars'];
let planets = [...initialPlanets];

export const planetFields = {
  planet: {
    type: GraphQLString,
    description: 'A planet',
    args: { name: { type: GraphQLString } },
    resolve(_, { name }) {
      const planetIsKnown = planets.includes(name);
      if (!planetIsKnown) return Promise.resolve(`I don't know where ${name} is!`);
      return Promise.resolve(name);
    },
  },
  planets: {
    type: new GraphQLList(GraphQLString),
    description: 'All planets',
    resolve() {
      return Promise.resolve(planets);
    },
  },
};

export const planetMutationFields = {
  addPlanet: {
    type: new GraphQLList(GraphQLString),
    description: 'Add a new planet by passing a name',
    args: { name: { type: GraphQLString } },
    resolve(_, { name }) {
      planets.push(name);
      return Promise.resolve(planets);
    },
  },
};

export const resetPlanets = () => {
  planets = [...initialPlanets];
};
