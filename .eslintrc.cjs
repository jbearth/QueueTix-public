module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    "plugin:react/jsx-runtime",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
    "plugin:import/recommended"
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    "ecmaFeatures": {
      "jsx": true
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    "project": [
      "./tsconfig.json"
    ]
  },
  plugins: [
    'react',
    'react-refresh',
    '@typescript-eslint'
  ],
  settings: {
    "import/resolver": {
      "typescript": {
        "project": "./tsconfig.json"
      }
    },
    "react": {
      "version": "18.x"
    }
  },
  rules: {
    'react-refresh/only-export-components': 'warn',
    "linebreak-style": "off",
    "prettier/prettier": [
      "error",
      {
        "printWidth": 80,
        "endOfLine": "lf",
        "singleQuote": true,
        "tabWidth": 2,
        "indentStyle": "space",
        "useTabs": true,
        "trailingComma": "es5"
      }
    ],
    // Disallow the `any` type.
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/ban-types": [
      "error",
      {
        "extendDefaults": true,
        "types": {
          "{}": false
        }
      }
    ],
    "react-hooks/exhaustive-deps": "off",
    // Enforce the use of the shorthand syntax.
    "object-shorthand": "error",
    "no-console": "warn",
    "no-unused-vars": [
      "error",{
        "vars": "all",
        "args":"after-used",
        "ignoreRestSiblings": false
      }
    ]
  },
  root: true,
}
