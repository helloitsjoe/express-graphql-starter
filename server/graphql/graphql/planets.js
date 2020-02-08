/* eslint-disable import/prefer-default-export */
import { GraphQLString, GraphQLList } from 'graphql';

const { buildSchema, GraphQLObjectType } = require('graphql');

const planets = ['World', 'Mars'];

export const planetFields = {
  planet: {
    type: GraphQLString,
    args: { name: { type: GraphQLString } },
    resolve(_, { name }) {
      return new Promise(resolve => {
        setTimeout(() => {
          const planetIsKnown = planets.includes(name);
          if (!planetIsKnown) return resolve(`I don't know where ${name} is!`);
          return resolve(name);
        }, 500);
      });
    },
  },
  planets: {
    type: new GraphQLList(GraphQLString),
    resolve() {
      return planets;
    },
  },
};

// const planetSchema = `
//   type Query {
//     planet(name: String!): String
//     planets: [String]
//   }

//   type Mutation {
//     addPlanet(name: String!): [String]
//   }
// `;

// const planetRoot = {
//   planet: args => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         const planetIsKnown = planets.includes(args.name);
//         if (!planetIsKnown) return resolve(`I don't know where ${args.name} is!`);
//         return resolve(args.name);
//       }, 500);
//     });
//   },
//   planets,
//   addPlanet: args => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         planets.push(args.name);
//         // return reject(new Error('nooo'));
//         return resolve(planets);
//       }, 500);
//     });
//   },
// };

// module.exports = {
//   planetRoot,
//   planetSchema,
// };
