module.exports = {
  root: true,
  env: {
    "browser": true,
    "esNEXT": true
  },
  plugins: ["react", "@typescript-eslint/eslint-plugin"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "eslint:recommended"
  ],
  extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
      '@react-native-community',
  ],
  overrides: [
  ],
  parserOptions: {
      "project": "tsconfig.json",
      "tsconfigRootDir": __dirname,
      "ecmaVersion": "latest",
      "sourceType": "module"
  },
  settings: {
    "import/resolver": {
      "typescript": {
        "project": "./tsconfig.json"
      }
    },
  },
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
    "no-unused-vars": [
      "warn",{
        "vars": "all",
        "args":"after-used",
        "ignoreRestSiblings": false
      }
    ]
  }
};
