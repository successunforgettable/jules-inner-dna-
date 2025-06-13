module.exports = {
  root: true,
  env: { node: true, es2021: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // Consider 'prettier' to integrate Prettier with ESLint
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'jest.config.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module', // Keep as module if using ES module syntax in TS, even if output is CJS
    project: './tsconfig.json', // Specify project for type-aware linting
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Can be 'warn' or 'error' if preferred
    // Add any other project-specific rules
  },
};
