import Vue from "vue";
import Vuex from "vuex";

// import example from './module-example'

Vue.use(Vuex);

// Load store modules dynamically.
// eslint-disable-next-line no-undef
/* const requireContext = require.context("./modules", false, /.*\.js$/);

const modules = requireContext
  .keys()
  .map(file => [file.replace(/(^.\/)|(\.js$)/g, ""), requireContext(file)])
  .reduce((modules, [name, module]) => {
    debugger;
    if (module.namespaced === undefined) {
      module.namespaced = true;
    }

    return { ...modules, [name]: module };
  }, {}); */

// https://webpack.js.org/guides/dependency-management/#requirecontext
// eslint-disable-next-line no-undef
const modulesFiles = require.context("./modules", false, /\.js$/);

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = modulesFiles(modulePath);
  modules[moduleName] = value.default;
  return modules;
}, {});

//export default function(/* { ssrContext } */) {
const store = new Vuex.Store({
  modules,

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEV
});

//  return store;
//}
export default store;
