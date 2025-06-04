// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    "expo",
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:@tanstack/query/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["react-you-might-not-need-an-effect"],
  rules: {
    "react-you-might-not-need-an-effect/you-might-not-need-an-effect": "warn",
    "prettier/prettier": "warn",
    "react/no-unstable-nested-components": ["warn"],
    "max-params": ["warn", 3],
    "import/no-cycle": "error",
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
        ],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
  },
};
