import VueAuthHref from "./vue-auth-href-directive"
import store from "store/index"

export default ({ Vue }) => {
  const options = {
    token: () => store.getters["auth/token"],
    downloadingText: "Descargando",
  }
  Vue.use(VueAuthHref, options)
}
