module.exports = {
  root: true,

  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module",
  },

  env: {
    browser: true,
  },

  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ["plugin:vue/essential", "@vue/prettier"],

  // required to lint *.vue files
  plugins: ["vue"],

  globals: {
    ga: true, // Google Analytics
    cordova: true,
    __statics: true,
    process: true,
  },

  // add your custom rules here
  // (example rules: https://github.com/prettier/prettier/issues/5844#issuecomment-462521665)
  rules: {
    "prefer-promise-reject-errors": "off",
    // "vue/html-closing-bracket-newline": ["error", {
    //   "singleline": "never",
    //   "multiline": "never"
    // }],
    "prettier/prettier": [
      "error",
      {
        semi: false,
        // singleQuote: true,
        trailingComma: "all",
        // not wroking. at all =( conflicts with "vue/html-closing-bracket-newline"
        htmlWhitespaceSensitivity: "ignore",
        "html-whitespace-sensitivity": "ignore",
      },
    ],

    // allow console.log during development only
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    // allow debugger during development only
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
}
