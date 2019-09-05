import store from "store"
import router from "router/index"

export function getKey() {
  const userId = store.getters && store.getters["auth/userId"]
  const key = "filtros_" + userId

  return key
}

export function getFilters(filterName = null) {
  const key = getKey()
  const userFilters = JSON.parse(localStorage.getItem(key))
  const seccion = router.currentRoute.name

  if (filterName == null) {
    return userFilters || []
  } else {
    return _.find(userFilters, { seccion: seccion, nombre: filterName }) || []
  }
}

export function saveFilters(newfilter) {
  const key = getKey()
  const filtrosGuardados = _.map([...getFilters(null)], filtro => {
    filtro.setted = false
    return filtro
  })

  const filtrosGuardadosYnuevoFiltro = _.concat(filtrosGuardados, newfilter)
  localStorage.setItem(key, JSON.stringify(filtrosGuardadosYnuevoFiltro))
}

export function removeFilters(filterName) {
  const key = getKey()
  let userFilters = _.remove([...getFilters()], function(filter) {
    return filter.nombre != filterName
  })

  localStorage.setItem(key, JSON.stringify(userFilters))
}

export function updateFilterLocalStorage(filterUpdated) {
  const key = getKey()
  let filtrosGuardados = [...getFilters(null)]

  if (filterUpdated == null || filterUpdated.setted == true) {
    // si  viene null queda null y si viene como setted se ponen todos en false y el el proximo paso este queda setted true.
    filtrosGuardados = _.map([...filtrosGuardados], filtro => {
      filtro.setted = false
      return filtro
    })
  }

  if (filterUpdated) {
    filtrosGuardados = _.map([...filtrosGuardados], filtro => {
      if (filtro.nombre == filterUpdated.nombre) {
        filtro = filterUpdated
      }

      return filtro
    })
  }

  localStorage.setItem(key, JSON.stringify(filtrosGuardados))
}
