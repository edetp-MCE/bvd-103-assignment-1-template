
const js = require("@eslint/js");
const globals = require("globals");

module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  extends: [js.configs.recommended],
  globals: {
    ...globals.node,
  },
  rules: {
  
  },
};
