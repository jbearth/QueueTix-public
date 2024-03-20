module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    ecmaVersion: "2023",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "eslint:recommended"
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  settings: {
    "import/resolver": {
      "typescript": {
        "project": "./tsconfig.json"
      }
    },
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "semi": [2, "always"],
    "space-before-function-paren": [0, {"anonymous": "always", "named": "always"}],
    "camelcase": 0,
    "no-return-assign": 0,
    "quotes": ["error", "double"],
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "no-unused-vars": [
      "warn",{
        "vars": "all",
        "args":"after-used",
        "ignoreRestSiblings": false
      }
    ]
  }
};
