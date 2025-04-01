export default {
    transform: {"^.+\\.[t|j]sx?$": "babel-jest",},
    testEnvironment: "jsdom",
    extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],
    moduleNameMapper: {
      "^(\\.{1,2}/.*)\\.js$": "$1", },
  };