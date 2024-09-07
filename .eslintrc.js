// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    "expo",
    "prettier",
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "warn",
    "react/no-unstable-nested-components": ["warn"],
    "max-params": ["warn", 3],
    "import/no-cycle": "error",
  },
};