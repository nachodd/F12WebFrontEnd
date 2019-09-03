import store from "store"
import router from "router/index"

export function getFilters(filterName = null) {
  const userId = store.getters && store.getters["auth/userId"]
  const userFilters = JSON.parse(localStorage.getItem("filtros_" + userId))
  const seccion = router.currentRoute.name

  if (filterName == null) {
    return userFilters || []
  } else {
    return _.find(userFilters, { seccion: seccion, nombre: filterName }) || []
  }
}

export function saveFilters(newfilter) {
  const userId = store.getters["auth/userId"]
  const key = "filtros_" + userId
  const filtrosGuardados = [...getFilters(null)]
  const filtrosGuardadosYnuevo = _.concat(filtrosGuardados, newfilter)

  localStorage.setItem(key, JSON.stringify(filtrosGuardadosYnuevo))
}
