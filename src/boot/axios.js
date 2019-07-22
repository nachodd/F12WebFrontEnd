import request from "utils/request"

// FIXME: Este archivo no tiene mucho sentido, ya que se usa el request directamente en los archivos de /api y no en los componentes
export default async ({ /* router, store, */ Vue }) => {
  Vue.prototype.$axios = request
}
