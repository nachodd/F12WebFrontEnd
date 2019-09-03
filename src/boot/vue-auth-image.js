import VueAuthImage from "./auth-image-directive"
import store from "store/index"

export default ({ Vue }) => {
  const options = {
    token: () => store.getters["auth/token"],
    downloadingText: "Cargando",
  }
  Vue.use(VueAuthImage, options)
}
