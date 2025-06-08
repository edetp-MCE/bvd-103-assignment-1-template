import js from "@eslint/js";
import parserTs from "@typescript-eslint/parser";
import pluginTs from "@typescript-eslint/eslint-plugin";

export default [
  js.configs.recommended,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": pluginTs,
    },
    rules: {
      "no-unused-vars": "off", 
      "@typescript-eslint/no-unused-vars": "warn",
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
    },
  },
];
