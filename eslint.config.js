const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    plugins: {},
    rules: {
      ...js.configs.recommended.rules,
    },
  },
];
