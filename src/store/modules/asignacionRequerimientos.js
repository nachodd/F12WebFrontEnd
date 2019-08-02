import {
  getRequerimientosForPanelAsignacion,
  asignarRequerimiento,
  desasignarRequerimiento,
  refuseRequerimiento,
  pasarAProcesosRequerimiento,
  enviarAPriorizarRequerimiento,
} from "api/requerimientos"
import Requerimiento from "models/requerimiento"
import {
  filterByAsuntoAndDescripcion,
  filterBySistema,
  filterByTipoRequerimiento,
  filterByUsuariosAsignados,
} from "utils/requerimientos"
import { pipeWith } from "utils/helpers"

const state = {
  requerimientos: [],
  loadingRequerimientos: false,
  requerimientosLoaded: false,
  dialogConfirmOpen: false,
  possibleChanges: {
    sourceList: [],
    sourceChanges: {
      addedIndex: null,
      removedIndex: null,
      changesSetted: false,
    },
    targetList: [],
    targetChanges: {
      addedIndex: null,
      removedIndex: null,
      changesSetted: false,
    },
    payload: {},
    newOrder: null,
  },
  filtros: {
    sistema: null,
    requerimientoTipo: null,
    descripcion: null,
    usuariosAsignados: [],
  },
}
const getters = {
  requerimientosSinAsignar: (state, getters, rootState, rootGetters) => {
    const estSinAsig = rootGetters["requerimientos/getEstadoByCodigo"]("NOAS")
    const estEnProceso = rootGetters["requerimientos/getEstadoByCodigo"]("STPR")
    let reqsResult = _.filter(state.requerimientos, req => {
      return _.includes([estSinAsig.id, estEnProceso.id], req.estado.id)
    })
    return _.orderBy(reqsResult, ["tipo.id", "prioridad"], "asc")
  },
  requerimientosAsignados: (state, getters, rootState, rootGetters) => {
    const estAsignado = rootGetters["requerimientos/getEstadoByCodigo"]("ASSI")
    const reqsResult = _.filter(state.requerimientos, {
      estado: { id: estAsignado.id },
    })
    return _.orderBy(reqsResult, ["estado.asignacion.orden"], "asc")
  },
  requerimientosEnEjecucion: (state, getters, rootState, rootGetters) => {
    const estadoEnEjec = rootGetters["requerimientos/getEstadoByCodigo"]("EXEC")
    const reqsResult = _.filter(state.requerimientos, {
      estado: { id: estadoEnEjec.id },
    })
    return _.orderBy(reqsResult, "tipo.id", "asc")
  },
  requerimientosEnEjecucionYTesting: (
    state,
    getters,
    rootState,
    rootGetters,
  ) => {
    const estadoEnEjec = rootGetters["requerimientos/getEstadoByCodigo"]("EXEC")
    const estadoEnTest = rootGetters["requerimientos/getEstadoByCodigo"]("TEST")
    const reqsResult = _.filter(state.requerimientos, req => {
      return _.includes([estadoEnEjec.id, estadoEnTest.id], req.estado.id)
    })
    return _.orderBy(reqsResult, "tipo.id", "asc")
  },
  // Devuelve la lista de reqs filtrada. La lista filtrada depende del estado pasado por param
  requerimientosFiltered: (state, getters) => reqEstado => {
    let reqs
    switch (reqEstado) {
      case "NOAS":
      case "STPR":
        reqs = [...getters.requerimientosSinAsignar]
        break
      case "ASSI":
        reqs = [...getters.requerimientosAsignados]
        break
      case "EXEC":
        reqs = [...getters.requerimientosEnEjecucion]
        break
      case "EXEC/TEST":
        reqs = [...getters.requerimientosEnEjecucionYTesting]
        break
    }

    const {
      descripcion = null,
      sistema = null,
      requerimientoTipo = null,
      usuariosAsignados = null,
    } = state.filtros

    // Determino que filtros aplicar, dependiendo de que hayan seteado
    let filtersToApply = []
    if (descripcion !== null) {
      filtersToApply.push(filterByAsuntoAndDescripcion(descripcion))
    }
    if (sistema && sistema.id) {
      filtersToApply.push(filterBySistema(sistema.id))
    }
    if (requerimientoTipo && requerimientoTipo.id) {
      filtersToApply.push(filterByTipoRequerimiento(requerimientoTipo.id))
    }
    const isAssigOrInExec = reqEstado === "ASSI" || reqEstado === "EXEC"
    if (isAssigOrInExec && usuariosAsignados && usuariosAsignados.length) {
      filtersToApply.push(filterByUsuariosAsignados(usuariosAsignados))
    }
    // aplica a reqs el conjunto de filtros
    return pipeWith(reqs, ...filtersToApply)
  },
  // Los cambios estaran seteados si: fueron seteados los 2 listados y el payload
  // o si fue seteado el source Y es el ultimo de la cadena de mando (si es así, solo tiene ese listado)
  possibleChangesSetted: state => {
    return (
      state.possibleChanges.sourceChanges.changesSetted &&
      state.possibleChanges.targetChanges.changesSetted &&
      Boolean(state.possibleChanges.payload.id)
    )
  },
  // - arrastrar de pendientes a aprobados => confirmar y disparar update aprobados y pendientes
  operationAssign: state => {
    const { sourceChanges, targetChanges } = state.possibleChanges
    return (
      targetChanges.removedIndex === null &&
      targetChanges.addedIndex !== null &&
      sourceChanges.removedIndex !== null &&
      sourceChanges.addedIndex === null
    )
  },
  // - arrastrar de aprobados a pendientes => confirmar y disparar update aprobados y pendientes
  operationPending: state => {
    const { sourceChanges, targetChanges } = state.possibleChanges
    return (
      targetChanges.removedIndex !== null &&
      targetChanges.addedIndex === null &&
      sourceChanges.removedIndex === null &&
      sourceChanges.addedIndex !== null
    )
  },
  operationReoderAssignedList: state => {
    const { sourceChanges, targetChanges } = state.possibleChanges
    return (
      targetChanges.removedIndex !== null &&
      targetChanges.addedIndex !== null &&
      sourceChanges.removedIndex === null &&
      sourceChanges.addedIndex === null
    )
  },
  operationType: (state, getters) => {
    if (
      !getters.operationReoderAssignedList &&
      getters.operationAssign &&
      !getters.operationPending
    ) {
      return "assign"
    } else if (
      !getters.operationReoderAssignedList &&
      !getters.operationAssign &&
      getters.operationPending
    ) {
      return "pending"
    } else if (
      getters.operationReoderAssignedList &&
      !getters.operationAssign &&
      !getters.operationPending
    ) {
      return "reorder-assigned"
    } else {
      return ""
    }
  },
  requerimientoIdToChange: state =>
    _.get(state.possibleChanges.payload, "id", ""),
  getNewOrder: (state, getters) => {
    // Busca el requerimiento a actualizar en el listado que está en pantalla en pantalla
    const reqsAsignadosOnScreen = state.possibleChanges.targetList
    const index = _.findIndex(reqsAsignadosOnScreen, {
      id: getters.requerimientoIdToChange,
    })
    // De estos, busco el siguiente en pantalla
    const nextReq = reqsAsignadosOnScreen[index + 1]
    if (nextReq) {
      // Si lo encuentra, devuelve su orden e indico que NO es el ultimo
      return {
        orden: nextReq.estado.asignacion.orden,
        ultimo: false,
      }
    } else {
      // Caso contario, determino el orden REAL
      let orden
      // Si no hay otros reqs asignados, orden = 1
      if (getters.requerimientosAsignados.length === 0) {
        orden = 1
      } else {
        // Busco el último reqs de los asignados, tomo su orden y le aumento 1
        const lastReq =
          getters.requerimientosAsignados[
            getters.requerimientosAsignados.length - 1
          ]
        orden = lastReq.estado.asignacion.orden + 1
      }
      // Será el ultimo (ya sea porque se filtro el listado y no hay nadao porque efectivametne no habia otro asignado)
      return {
        orden,
        ultimo: true,
      }
    }
  },
  requerimientosFilteredLength: (state, getters) => {
    return getters.requerimientosFiltered("ASSI").length
  },
}

const mutations = {
  SET_REQUERIMIENTOS: (state, requerimientos) => {
    state.requerimientos = _.map(requerimientos, req => new Requerimiento(req))
    state.requerimientosLoaded = true
  },
  SET_LOADING_REQUERIMIENTOS: (state, loadingRequerimientos) => {
    state.loadingRequerimientos = loadingRequerimientos
  },
  SET_ESTADO_REQUERIMIENTO: (state, { requerimientoId, newState }) => {
    const reqToUpdate = _.find(state.requerimientos, { id: requerimientoId })
    reqToUpdate.estado = {
      ...reqToUpdate.estado,
      ...newState,
    }
  },
  SET_DIALOG_CONFIRM_OPERATION_OPEN: (state, value) => {
    state.dialogConfirmOpen = value
  },

  PROCESS_UPDATE_LISTS: (state, { listName, listResult, dropResult }) => {
    const { removedIndex, addedIndex, payload } = dropResult
    state.possibleChanges[`${listName}List`] = listResult
    state.possibleChanges[`${listName}Changes`] = {
      addedIndex,
      removedIndex,
      changesSetted: true, // seteo que hubo cambios en este listado
    }
    state.possibleChanges.payload = payload
  },
  SET_TARGET_LIST: (state, { targetList, reqIdToUpdate }) => {
    state.possibleChanges.targetList = targetList
    state.possibleChanges.payload = { id: reqIdToUpdate }
  },
  CLEAR_OPERATIONS: state => {
    for (const listName of ["source", "target"]) {
      state.possibleChanges[`${listName}List`] = []
      state.possibleChanges[`${listName}Changes`] = {
        addedIndex: null,
        removedIndex: null,
        changesSetted: false,
      }
    }
    state.possibleChanges.payload = {}
    state.possibleChanges.newOrder = null
    state.dialogConfirmOpen = false
  },
  SET_FILTROS: (state, { filter, value }) => {
    state.filtros[filter] = value
  },
  CLEAR_FILTROS: state => {
    state.filtros.sistema = null
    state.filtros.requerimientoTipo = null
    state.filtros.descripcion = null
    state.filtros.usuariosAsignados = []
  },

  UPDATE_REQUERIMIENTOS_ORDEN_ASIGNADO: (
    state,
    {
      estadoAsignadoId,
      orderStart,
      reqIdToAvoid,
      updateOrderToCurrentRequerimiento = false,
    },
  ) => {
    // Actualiza todos los requerimientos en estado ASIGNADO
    state.requerimientos = state.requerimientos.map(ra => {
      if (ra.estado.id === estadoAsignadoId) {
        // Que tengan orden mayor o igual a orderStart y NO sea el reqerumiento asignado
        const tieneOrdenMayorOIgual = ra.estado.asignacion.orden >= orderStart
        if (tieneOrdenMayorOIgual && ra.id !== reqIdToAvoid) {
          ra.estado.asignacion.orden += 1
        }
      }
      // Actualizo el orden del requerimiento en cuestion solo si es declarado explicitamente con updateOrderToCurrentRequerimiento=true (caso reordenamiento)
      if (updateOrderToCurrentRequerimiento && ra.id === reqIdToAvoid) {
        ra.estado.asignacion.orden = orderStart
      }
      return ra
    })
  },
  PUSHER_UPDATE_REQUERIMIENTO: (state, { operation, req }) => {
    switch (operation) {
      case "add": {
        state.requerimientos.push(new Requerimiento(req))
        break
      }
      case "update": {
        const removedIndex = _.findIndex(state.requerimientos, {
          id: req.id,
        })
        state.requerimientos.splice(removedIndex, 1, new Requerimiento(req))
        break
      }
      case "delete": {
        const removedIndex = _.findIndex(state.requerimientos, {
          id: req.id,
        })
        state.requerimientos.splice(removedIndex, 1)
        break
      }
    }
  },
}

const actions = {
  fetchRequerimientos({ commit, rootGetters }, userId = null) {
    return new Promise(async (resolve, reject) => {
      try {
        // commit("app/LOADING_INC", null, { root: true })
        commit("SET_LOADING_REQUERIMIENTOS", true)
        // Determino el userId para los requerimientos
        const userIdForRequerimientos = userId
          ? userId
          : rootGetters["auth/userId"]
        const requerimientos = await getRequerimientosForPanelAsignacion(
          userIdForRequerimientos,
        )
        commit("SET_REQUERIMIENTOS", requerimientos)
        resolve()
      } catch (error) {
        reject(error)
      } finally {
        // commit("app/LOADING_DEC", null, { root: true })
        commit("SET_LOADING_REQUERIMIENTOS", false)
      }
    })
  },
  updateRequerimientoState(
    { commit, dispatch, rootGetters, getters, state },
    { operation, requerimientoId, comentario, ...data },
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        commit("app/LOADING_INC", null, { root: true })
        const userId = rootGetters["auth/userId"]
        // const reqsBackUp = [...state.requerimientos]
        let message = ""

        switch (operation) {
          case "asignar": {
            // se arma el objeto para enviar a la api y se la llama
            const { orden, ultimo } = getters.getNewOrder
            const dataAsignar = {
              usuario: userId,
              usuario_asignado: data.usuarioAsignado.value,
              fecha_finalizacion_estimada: data.fechaFinalizacion,
              horas_estimadas: data.horasEstimadas,
              comentario,
              orden,
              ultimo,
            }
            const res = await asignarRequerimiento(requerimientoId, dataAsignar)
            message = _.get(res, "data.message", null)

            // Se armar el objeto 'estado' para actualizar el objeto en el array local
            const estadoAsignado = rootGetters[
              "requerimientos/getEstadoByCodigo"
            ]("ASSI")
            const newState = {
              id: estadoAsignado.id,
              descripcion: estadoAsignado.descripcion,
              asignacion: {
                usuario_id: data.usuarioAsignado.value,
                usuario_nombre: data.usuarioAsignado.label,
                orden,
              },
            }
            // Updateo el estado
            commit("SET_ESTADO_REQUERIMIENTO", { requerimientoId, newState })

            // Updatea el Orden de todo el arbol y el orden
            commit("UPDATE_REQUERIMIENTOS_ORDEN_ASIGNADO", {
              estadoAsignadoId: estadoAsignado.id,
              orderStart: orden,
              reqIdToAvoid: requerimientoId,
            })
            break
          }
          case "desasignar": {
            const res = await desasignarRequerimiento(requerimientoId, {
              comentario,
            })
            message = _.get(res, "data.message", null)

            // Se armar el objeto 'estado' para actualizar el objeto en el array local
            const estadoAsignado = rootGetters[
              "requerimientos/getEstadoByCodigo"
            ]("NOAS")
            const newState = {
              id: estadoAsignado.id,
              descripcion: estadoAsignado.descripcion,
              asignacion: null,
            }
            commit("SET_ESTADO_REQUERIMIENTO", { requerimientoId, newState })
            break
          }
          case "reordenar": {
            message = await dispatch("operationSaveReorderAssigned")
            break
          }
          case "aProcesos": {
            const res = await pasarAProcesosRequerimiento(requerimientoId, {
              comentario,
            })
            message = _.get(res, "data.message", null)

            break
          }
          case "descartar":
          case "aPriorizar": {
            let res
            if (operation === "descartar") {
              res = await refuseRequerimiento(requerimientoId, {
                comentario,
              })
            } else if (operation === "aPriorizar") {
              res = await enviarAPriorizarRequerimiento(requerimientoId, {
                comentario,
              })
            }

            message = _.get(res, "data.message", null)

            // Quitamos el requerimiento del listado:
            const removedIndex = _.findIndex(state.requerimientos, {
              id: requerimientoId,
            })
            let listResult = [...state.requerimientos]
            listResult.splice(removedIndex, 1)

            commit("SET_REQUERIMIENTOS", listResult)
            break
          }
        }
        dispatch("app/getDashboardData", null, { root: true })
        resolve(message)
      } catch (error) {
        reject(error)
      } finally {
        commit("app/LOADING_DEC", null, { root: true })
        dispatch("clearOperations")
      }
    })
  },
  updateTargetList({ commit }, data) {
    return new Promise(async resolve => {
      commit("SET_TARGET_LIST", data)
      resolve()
    })
  },
  processUpdateList({ state, commit, getters, dispatch }, updatedListData) {
    // console.log(getters.operationType)
    return new Promise(async (resolve, reject) => {
      try {
        // updatea los listados temporales
        commit("PROCESS_UPDATE_LISTS", updatedListData)

        if (!getters.possibleChangesSetted) {
          return
        }
        commit("app/LOADING_INC", null, { root: true })

        switch (getters.operationType) {
          case "assign":
          case "pending":
            // se setea el requerimiento abierto en el store y luego se abre el modal de confirmacion
            await dispatch(
              "requerimientos/setDetalleRequerimiento",
              {
                reqId: getters.requerimientoIdToChange,
                listName: "asignar-requerimientos",
              },
              { root: true },
            )
            dispatch("setDialogConfirmOperationOpen", true)
            resolve()
            break
          case "reorder-assigned": {
            // Solo si movio algo ejecuta la accion
            if (
              state.possibleChanges.targetChanges.addedIndex !==
              state.possibleChanges.targetChanges.removedIndex
            ) {
              const message = await dispatch("operationSaveReorderAssigned")
              resolve(message)
            }
            dispatch("clearOperations")
            break
          }
          default:
            dispatch("clearOperations")
            resolve()
            break
        }
      } catch (error) {
        reject(error)
      } finally {
        commit("app/LOADING_DEC", null, { root: true })
      }
    })
  },
  operationSaveReorderAssigned({ commit, getters, rootGetters }) {
    return new Promise(async (resolve, reject) => {
      try {
        // se arma el objeto para enviar a la api y se la llama
        const { orden, ultimo } = getters.getNewOrder
        const dataReordenar = {
          orden,
          ultimo,
        }
        const res = await asignarRequerimiento(
          getters.requerimientoIdToChange,
          dataReordenar,
        )
        const message = _.get(res, "data.message", null)

        // Updatea el Orden de todo el arbol y el orden
        const estadoAsignado = rootGetters["requerimientos/getEstadoByCodigo"](
          "ASSI",
        )
        commit("UPDATE_REQUERIMIENTOS_ORDEN_ASIGNADO", {
          estadoAsignadoId: estadoAsignado.id,
          orderStart: orden,
          reqIdToAvoid: getters.requerimientoIdToChange,
          updateOrderToCurrentRequerimiento: true,
        })

        resolve(message)
      } catch (error) {
        reject(error)
      }
    })
  },
  setDialogConfirmOperationOpen({ commit, dispatch }, value = true) {
    commit("SET_DIALOG_CONFIRM_OPERATION_OPEN", value)
    if (!value) {
      dispatch("clearOperations")
    }
  },
  clearOperations({ commit }) {
    return new Promise(resolve => {
      commit("CLEAR_OPERATIONS")
      resolve()
    })
  },
  setFilter({ commit }, { filter, value }) {
    return new Promise(resolve => {
      commit("SET_FILTROS", { filter, value })
      resolve()
    })
  },
  clearFilters({ commit }) {
    return new Promise(resolve => {
      commit("CLEAR_FILTROS")
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
