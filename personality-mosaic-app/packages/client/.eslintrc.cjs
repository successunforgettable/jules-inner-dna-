module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true }, // Added node: true for config files
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime', // For new JSX transform
    'plugin:react-hooks/recommended',
    // Consider 'plugin:jsx-a11y/recommended' for accessibility
    // Consider 'prettier' to integrate Prettier with ESLint, requires eslint-config-prettier
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', 'vitest.config.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json', // Specify project for type-aware linting
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['@typescript-eslint', 'react-refresh', 'react'], // Added 'react'
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_' },
    ],
    'react/prop-types': 'off', // Using TypeScript for prop types
    // Add any other project-specific rules
  },
};
