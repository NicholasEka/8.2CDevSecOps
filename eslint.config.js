module.exports = [
  {
    files: [
      "*.js",
      "routes/**/*.js",
      "service/**/*.js",
      "entity/**/*.js"
    ],

    ignores: [
      "node_modules/**",
      "public/**"
    ],

    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs"
    },

    rules: {
      "no-unused-vars": "warn",
      "eqeqeq": "warn",
      "complexity": ["warn", 15],
      "no-constant-condition": "warn"
    }
  }
];