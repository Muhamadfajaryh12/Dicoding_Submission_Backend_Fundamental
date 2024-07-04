module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["airbnb-base"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "no-console": "off",
    "no-underscore-dangle": "off",
    "linebreak-style": "off",
    semi: "off",
    "comma-dangle": "off",
    "no-unused-vars": "off",
    "max-len": "off",
    quotes: "off",
    camelcase: "off",
    "implicit-arrow-linebreak": "off",
    "operator-linebreak": "off",
    "object-shorthand": "off",
    "object-curly-newline": "off",
  },
};
