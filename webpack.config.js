// NOTE: This file porpuose is ONLY for WebStorm to recognize path aliases.
// The REAL ALLIASES are defined in quasar.conf.js

// eslint-disable-next-line no-undef
const path = require("path")
// eslint-disable-next-line no-undef
const webpack = require("webpack")

// eslint-disable-next-line no-undef
module.exports = {
  resolve: {
    extensions: [".js", ".json", ".vue"],
    alias: {
      // eslint-disable-next-line no-undef
      "@api": path.resolve(__dirname, "./src/api"),
      // eslint-disable-next-line no-undef
      "@comp": path.resolve(__dirname, "./src/components"),
      // eslint-disable-next-line no-undef
      "@mixins": path.resolve(__dirname, "./src/mixins"),
      // eslint-disable-next-line no-undef
      "@utils": path.resolve(__dirname, "./src/utils"),
      // eslint-disable-next-line no-undef
      "@router": path.resolve(__dirname, "./src/router"),
      // eslint-disable-next-line no-undef
      "@boot": path.resolve(__dirname, "./src/boot"),
      // eslint-disable-next-line no-undef
      "@store": path.resolve(__dirname, "./src/store"),
      // eslint-disable-next-line no-undef
      "@models": path.resolve(__dirname, "./src/models"),
    },
  },
}
