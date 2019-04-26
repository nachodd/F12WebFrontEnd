// eslint-disable-next-line no-undef
const env = require("./env")
// eslint-disable-next-line no-undef
// var envparser = require("./envparser")

// eslint-disable-next-line no-undef
module.exports = function(ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: ["axios", "router-hooks", "permission-directive", "filters"], // "vuelidate"

    css: ["app.scss"],

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
      ],

      directives: ["Ripple", "ClosePopup"],

      // Quasar plugins
      plugins: ["Dialog", "Notify", "LoadingBar"],
      iconSet: "fontawesome-v5",
      // iconSet: 'ionicons-v4'
      // lang: 'de' // Quasar language
    },

    supportIE: false,

    build: {
      scopeHoisting: true,
      vueRouterMode: "history",
      // env: envparser(),
      env: {
        VUE_APP_BASE_API: JSON.stringify(env.VUE_APP_BASE_API),
        VUE_APP_CLIENT_ID: JSON.stringify(env.VUE_APP_CLIENT_ID),
        VUE_APP_CLIENT_SECRET: JSON.stringify(env.VUE_APP_CLIENT_SECRET),
      },
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
      },
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true, // opens browser window automatically
    },

    // animations: 'all' --- includes all animations
    animations: [],

    ssr: {
      pwa: false,
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#027be3",
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
