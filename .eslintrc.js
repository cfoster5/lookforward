module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "universe/native",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    "react/no-unstable-nested-components": ["warn"],
    "max-params": ["warn", 3],
  },
};
