export default {
    transform: {"^.+\\.[t|j]sx?$": "babel-jest",},
    testEnvironment: "jsdom",
    extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],
    moduleNameMapper: {
      "\\.css$": "identity-obj-proxy",
      "^(\\.{1,2}/.*)\\.js$": "$1", },
  };