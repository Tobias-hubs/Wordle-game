// export default {
//     transform: {
//       '^.+\\.(js|jsx|mjs)$': 'jest-esm-transformer',
//     },
//     testEnvironment: 'node',
//   };
// module.exports = {
//   transform: {
//     "^.+\\.(js|jsx)$": "babel-jest"
//   },
//   testEnvironment: "jsdom" 
// };
export default {
  transform: {"^.+\\.[t|j]sx?$": "babel-jest",},
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", },
};
