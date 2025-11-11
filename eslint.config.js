import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default defineConfig([
  globalIgnores(["dist"]),
  // ! Common JS rules
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "no-var": "error",
      "no-console": "warn",
      "max-params": ["error", { max: 4 }],
      "default-case": "error",
      "no-else-return": "error",
      "no-multi-assign": "error",
      "no-param-reassign": "error",
    },
  },

  // ! TS files typescript rules
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "typescript-eslint": tseslint },
    extends: [
      "typescript-eslint/recommendedTypeChecked",
      tseslint.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/prefer-find": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-array-delete": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "error",
      "@typescript-eslint/prefer-reduce-type-parameter": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          minimumDescriptionLength: 5,
          "ts-check": false,
          "ts-expect-error": "allow-with-description",
          "ts-ignore": true,
          "ts-nocheck": true,
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  // ! Prettier rules
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          printWidth: 100,
          checkIgnorePragma: true,
        },
      ],
    },
  },
  eslintPluginPrettierRecommended,
]);
