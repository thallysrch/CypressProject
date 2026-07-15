module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    'cypress/globals': true,
  },
  extends: ['eslint:recommended', 'plugin:cypress/recommended', 'prettier'],
  plugins: ['cypress'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script',
  },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
    'cypress/unsafe-to-chain-command': 'off',
    'cypress/no-assigning-return-values': 'off',
  },
  ignorePatterns: ['node_modules/', 'cypress/reports/', 'cypress/artifacts/'],
};
