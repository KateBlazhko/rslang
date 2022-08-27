module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json'
  },
  plugins: [
    '@typescript-eslint',
    'import'
  ],
  rules: {
    "no-unused-vars": "off",
    "import/extensions": 0,
    "import/no-unresolved": 0,
    "no-underscore-dangle":  'off',
    "no-console": 'off',
    "no-param-reassign": ["error", { "props": false }],
    "no-shadow": ["error", { "allow": ["TextInner", "ButtonHrefContent"] }]
  },
}
