// ESLint Flat Config for Expo + React Native + TypeScript
// Base: eslint-config-expo (includes React, React Native, Hooks, TS parser)
// Extras: Prettier integration, import order, unused imports, Node globals for config files

// @ts-check
const { defineConfig, globalIgnores } = require('eslint/config');
const globals = require('globals');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  globalIgnores(['dist/**', 'build/**', 'coverage/**']),
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
    },
    plugins: {
      'simple-import-sort': require('eslint-plugin-simple-import-sort'),
      'unused-imports': require('eslint-plugin-unused-imports'),
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      // TypeScript & unused imports
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'unused-imports/no-unused-imports': 'warn',

      // React hooks (already included via expoConfig, but ensure strictness)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Import order
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // Side effect imports.
            ['^\u0000'],
            // Packages.
            ['^@?\w'],
            // Aliases starting with @/
            ['^@/'],
            // Parent imports and relatives.
            ['^\.\.(?!/?$)', '^\.\./?$'],
            ['^\./(?=.*/)(?!/?$)', '^\.(?!/?$)', '^\./?$'],
            // Style imports.
            ['^.+\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',

      // Import sanity
      'import/first': 'warn',
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'warn',
    },
  },
  // Enable Node.js globals for config files
  {
    files: [
      'babel.config.js',
      'metro.config.js',
      'jest.config.{js,cjs,mjs,ts}',
      'app.config.{js,ts}',
      'app.config.*.{js,ts}',
    ],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    ignores: ['.expo/**', 'node_modules/**', 'android/**', 'ios/**'],
  },
]);
