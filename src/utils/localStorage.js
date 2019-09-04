import store from "store"
import router from "router/index"

export function getKey() {
  const userId = store.getters && store.getters["auth/userId"]
  const key = "filtros_" + userId

  return key
}

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
  const filtrosGuardados = _.map([...getFilters(null)], filtro => {
    filtro.setted = false
    return filtro
  })

  if (newfilter) {
    const filtrosGuardadosYnuevoFiltro = _.concat(filtrosGuardados, newfilter)
    localStorage.setItem(key, JSON.stringify(filtrosGuardadosYnuevoFiltro))
  } else {
    localStorage.setItem(key, JSON.stringify(filtrosGuardados))
  }
}

export function removeFilters(filterName) {
  const key = getKey()
  let userFilters = _.remove([...getFilters()], function(filter) {
    return filter.nombre != filterName
  })

  localStorage.setItem(key, JSON.stringify(userFilters))
}
