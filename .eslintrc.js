module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb-base', 'eslint:recommended',
    'plugin:react/recommended'],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },

};
