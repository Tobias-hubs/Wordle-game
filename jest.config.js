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
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest", 
    "^.+\\.js$": "babel-jest",

  },
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
     "^\\./game/gameLogic\\.js$": "<rootDir>/src/backend/game/gameLogic.js",
    "\\.css$": "identity-obj-proxy"
    },
    
};
