
import js from "@eslint/js";
import globals from "globals";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
  {
    files: ["**/*.js"],
    ignores: ["node_modules", "dist"],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },

    plugins: {
      "simple-import-sort": simpleImportSort,
    },

    rules: {
      ...js.configs.recommended.rules,

      // Import sorting
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
    },
  },
];
