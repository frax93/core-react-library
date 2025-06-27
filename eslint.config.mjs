// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginReact from 'eslint-plugin-react';
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginReact.configs.flat?.['recommended'] ?? {},
  eslintConfigPrettier,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      camelcase: 'warn',
      'class-methods-use-this': 0,
      'no-alert': 'error',
      'no-confusing-arrow': 0,
      'no-console': 2,
      'no-mixed-operators': 'warn',
      'no-param-reassign': 'warn',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'warn',
      'no-unused-expressions': 'error',
      'no-use-before-define': 0,
      'object-curly-newline': 'off',
      'operator-linebreak': 'off',
      'prefer-destructuring': 'warn',
      'prefer-template': 2,
      'react/display-name': [
        2,
        {
          ignoreTranspilerName: true,
        },
      ],
      'no-restricted-imports': ['error'],
    },
  },
);
