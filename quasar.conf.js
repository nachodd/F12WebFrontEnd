/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const path = require("path")
const webpack = require("webpack")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = function(ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      "axios",
      "router-hooks",
      // "permission-directive",
      "filters",
      "vue-auth-href",
      "vue-auth-image",
      "log",
    ], // "vuelidate"

    css: ["app.styl"],

    extras: [
      "roboto-font",
      "material-icons", // optional, you are not bound to it
      // 'ionicons-v4',
      // 'mdi-v3',
      "fontawesome-v5",
      // 'eva-icons'
    ],

    framework: {
      // all: true, // --- includes everything; for dev only!

      components: [
        "QMarkupTable",
        "QSpinnerHourglass",
        "QPageSticky",
        "QExpansionItem",
        "QToggle",
        "QBtnToggle",
        "QUploaderAddTrigger",
        "QChip",
        "QBar",
        "QSpace",
        "QInnerLoading",
        "QSpinnerGears",
        "QDialog",
        "QUploader",
        "QTooltip",
        "QPopupProxy",
        "QDate",
        "QSlideTransition",
        "QSelect",
        "QCheckbox",
        "QSlider",
        "QBadge",
        "QMenu",
        "QScrollArea",
        "QSeparator",
        "QAvatar",
        "QBtnDropdown",
        "QField",
        "QForm",
        "QInput",
        "QLayout",
        "QHeader",
        "QFooter",
        "QDrawer",
        "QPageContainer",
        "QPage",
        "QToolbar",
        "QToolbarTitle",
        "QBtn",
        "QIcon",
        "QList",
        "QItem",
        "QItemSection",
        "QItemLabel",
        "QCard",
        "QCardSection",
        "QCardActions",
        "QTimeline",
        "QTimelineEntry",
        "QTab",
        "QTabs",
        "QTabPanel",
        "QTabPanels",
        "QBanner",
        "QPagination",
        "QResizeObserver",
      ],

      directives: ["Ripple", "ClosePopup"],

      // Quasar plugins
      plugins: ["Dialog", "Notify", "Loading", "LoadingBar"],
      iconSet: "fontawesome-v5",
      lang: "es", // Quasar language
      // iconSet: 'ionicons-v4'
    },

    supportIE: false,

    build: {
      scopeHoisting: true,
      vueRouterMode: "history",
      // env: {
      //   VUE_APP_BASE_API: JSON.stringify(env.VUE_APP_BASE_API),
      //   VUE_APP_CLIENT_ID: JSON.stringify(env.VUE_APP_CLIENT_ID),
      //   VUE_APP_CLIENT_SECRET: JSON.stringify(env.VUE_APP_CLIENT_SECRET),
      // },
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack(cfg) {
        cfg.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /node_modules/,
        })

        cfg.plugins.push(
          new webpack.ProvidePlugin({
            _: "lodash",
          }),
        )

        cfg.plugins.push(new CopyWebpackPlugin([{ from: "src-pwa/.htaccess" }]))

        cfg.resolve.alias = {
          ...cfg.resolve.alias, // This adds the existing alias
          // Add your own alias like this
          // eslint-disable-next-line no-undef
          api: path.resolve(__dirname, "./src/api"),
          // eslint-disable-next-line no-undef
          comp: path.resolve(__dirname, "./src/components"),
          // eslint-disable-next-line no-undef
          mixins: path.resolve(__dirname, "./src/mixins"),
          // eslint-disable-next-line no-undef
          utils: path.resolve(__dirname, "./src/utils"),
          // eslint-disable-next-line no-undef
          router: path.resolve(__dirname, "./src/router"),
          // eslint-disable-next-line no-undef
          boot: path.resolve(__dirname, "./src/boot"),
          // eslint-disable-next-line no-undef
          store: path.resolve(__dirname, "./src/store"),
          // eslint-disable-next-line no-undef
          models: path.resolve(__dirname, "./src/models"),
        }
      },
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true, // opens browser window automatically
    },

    // animations: 'all' --- includes all animations
    animations: ["flipInY", "flipOutY"],

    ssr: {
      pwa: false,
    },

    pwa: {
      // workboxPluginMode: "InjectManifest",
      workboxOptions: {
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        name: "F12",
        short_name: "F12",
        description: "F12 - BLD s.a.",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#1565c0",
        icons: [
          {
            src: "statics/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "statics/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "statics/icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "statics/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "statics/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    },

    cordova: {
      // id: 'org.cordova.quasar.app'
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack(cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Window only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration
        // appId: 'quasar-app'
      },
    },
  }
}
