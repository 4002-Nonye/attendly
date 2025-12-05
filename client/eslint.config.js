import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },

    plugins: {
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],

      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'], // 1. Side-effect imports
            ['^react$', '^@?\\w'], // 2. React & packages
            ['^@', '^'], // 3. Absolute imports
            ['^\\./'], // 4. Relative same-folder imports
            ['^.+\\.(module.css|module.scss)$'], // 5. CSS Modules last
            ['^.+\\.(gif|png|svg|jpg)$'], // 6. Media files
          ],
        },
      ],
    },
  },
]);
