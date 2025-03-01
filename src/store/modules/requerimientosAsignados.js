import {
  getRequerimientosAsignadosByUser,
  ejecutarRequerimiento,
  cancelaEjecucionRequerimiento,
  finalizarRequerimiento,
  enviarATestingRequerimiento,
  cancelarTestingRequerimiento,
  pausarRequerimiento,
  reanudarRequerimiento,
} from "api/requerimientos"
import {
  filterByAsuntoAndDescripcion,
  filterBySistema,
  filterByTipoRequerimiento,
  // filterByUsuariosAsignados,
  // UpdatePendingPayloadPriorizarReq,
} from "utils/requerimientos"
import { pipeWith } from "utils/helpers"
import Requerimiento from "models/requerimiento"

const state = {
  requerimientos: [],
  // changesRequerimientos: [],
  loadingRequerimientos: false,

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
    testingList: [],
    testingChanges: {
      addedIndex: null,
      removedIndex: null,
      changesSetted: false,
    },
    payload: {},
  },
  filtros: {
    sistema: null,
    requerimientoTipo: null,
    descripcion: null,
  },
}

const getters = {
  requerimientoIdToChange: state => _.get(state.possibleChanges.payload, "id", ""),
  // Los cambios estaran seteados si: fueron seteados los 2 listados y el payload
  // o si fue seteado el source Y es el ultimo de la cadena de mando (si es así, solo tiene ese listado)
  possibleChangesSetted: state => {
    return (
      state.possibleChanges.sourceChanges.changesSetted &&
      state.possibleChanges.targetChanges.changesSetted &&
      state.possibleChanges.testingChanges.changesSetted &&
      Boolean(state.possibleChanges.payload.id)
    )
  },
  isPaused: state => {
    return _.get(state, "possibleChanges.payload.estado.pausado", false)
  },
  operationToExec: state => {
    const { sourceChanges, targetChanges, testingChanges } = state.possibleChanges
    return (
      sourceChanges.removedIndex !== null &&
      sourceChanges.addedIndex === null &&
      targetChanges.removedIndex === null &&
      targetChanges.addedIndex !== null &&
      testingChanges.removedIndex === null &&
      testingChanges.addedIndex === null
    )
  },
  operationToPending: state => {
    const { sourceChanges, targetChanges, testingChanges } = state.possibleChanges
    return (
      sourceChanges.removedIndex === null &&
      sourceChanges.addedIndex !== null &&
      targetChanges.removedIndex !== null &&
      targetChanges.addedIndex === null &&
      testingChanges.removedIndex === null &&
      testingChanges.addedIndex === null
    )
  },
  operationToTesting: state => {
    const { sourceChanges, targetChanges, testingChanges } = state.possibleChanges
    return (
      sourceChanges.removedIndex === null &&
      sourceChanges.addedIndex === null &&
      targetChanges.removedIndex !== null &&
      targetChanges.addedIndex === null &&
      testingChanges.removedIndex === null &&
      testingChanges.addedIndex !== null
    )
  },
  operationWrongToTesting: state => {
    const { sourceChanges, targetChanges, testingChanges } = state.possibleChanges
    return (
      sourceChanges.removedIndex !== null &&
      sourceChanges.addedIndex === null &&
      targetChanges.removedIndex === null &&
      targetChanges.addedIndex === null &&
      testingChanges.removedIndex === null &&
      testingChanges.addedIndex !== null
    )
  },
  operationWrongFromTesting: state => {
    const { testingChanges } = state.possibleChanges
    return testingChanges.removedIndex !== null && testingChanges.addedIndex === null
  },
  operationType: (state, getters) => {
    if (getters.operationToExec && !getters.operationToPending && !getters.operationToTesting) {
      return "execute"
    } else if (
      !getters.operationToExec &&
      getters.operationToPending &&
      !getters.operationToTesting
    ) {
      return "pending"
    } else if (
      !getters.operationToExec &&
      !getters.operationToPending &&
      getters.operationToTesting
    ) {
      return "test"
    } else {
      return ""
    }
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
    return _.orderBy(reqsResult, ["estado.pausado", "estado.asignacion.orden"], ["asc", "asc"])
  },
  requerimientosTesting: (state, getters, rootState, rootGetters) => {
    const estTesting = rootGetters["requerimientos/getEstadoByCodigo"]("TEST")
    const reqsResult = _.filter(state.requerimientos, {
      estado: { id: estTesting.id },
    })
    return _.orderBy(reqsResult, ["estado.asignacion.orden"], ["asc"])
  },
  // Devuelve la lista de reqs filtrada. La lista filtrada depende del estado pasado por param
  requerimientosFiltered: (state, getters) => reqEstado => {
    let reqs

    switch (reqEstado) {
      case "ASSI":
        reqs = [...getters.requerimientosAsignados]
        break
      case "EXEC":
        reqs = [...getters.requerimientosEnEjecucion]
        break
      case "TEST":
        reqs = [...getters.requerimientosTesting]
        break
    }
    const { descripcion = null, sistema = null, requerimientoTipo = null } = state.filtros

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
    // aplica a reqs el conjunto de filtros
    return pipeWith(reqs, ...filtersToApply)
  },
}

const mutations = {
  SET_REQS_LIST: (state, listData) => {
    // state.requerimientos = [...listData]
    state.requerimientos = _.map(listData, req => new Requerimiento(req))
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
  SET_DIALOG_CONFIRM_OPERATION_OPEN: (state, value) => {
    state.dialogConfirmOpen = value
  },
  CLEAR_OPERATIONS: state => {
    for (const listName of ["source", "target", "testing"]) {
      state.possibleChanges[`${listName}List`] = []
      state.possibleChanges[`${listName}Changes`] = {
        addedIndex: null,
        removedIndex: null,
        changesSetted: false,
      }
    }
    state.possibleChanges.payload = {}
    state.dialogConfirmOpen = false
  },
  UPDATE_REQ_ESTADO_ASSIGNED: (state, reqId) => {
    const req = state.requerimientos.find(r => r.id === reqId)
    req.estado = { ...req.estado, id: 4, descripcion: "Asignado" }
    req.estado.asignacion_testing = null
    req.estado.pausado = false
  },
  UPDATE_REQ_ESTADO_INEXCEC: (state, reqId) => {
    const req = state.requerimientos.find(r => r.id === reqId)
    req.estado = { ...req.estado, id: 5, descripcion: "En ejecución" }
    req.estado.asignacion_testing = null
    req.estado.pausado = false
  },
  UPDATE_REQ_ESTADO_PAUSED: (state, { reqId, paused }) => {
    const req = state.requerimientos.find(r => r.id === reqId)
    req.estado.pausado = paused
  },
  UPDATE_REQ_ESTADO_TESTING: (state, { reqId, usuarioTesting }) => {
    const req = state.requerimientos.find(r => r.id === reqId)
    req.estado = { ...req.estado, id: 10, descripcion: "Testing" }
    req.estado.asignacion_testing = {
      usuario_id: usuarioTesting.value,
      usuario_nombre: usuarioTesting.label,
    }
  },
  UPDATE_REQ_ESTADO_FINISH: (state, reqId) => {
    const index = _.findIndex(state.requerimientos, { id: reqId })
    if (index !== -1) {
      state.requerimientos.splice(index, 1)
    }
  },

  SET_FILTRO: (state, { filter, value }) => {
    state.filtros[filter] = value
  },
  SET_FILTROS: (state, filters) => {
    state.filtros["descripcion"] = filters.descripcion
    state.filtros["sistema"] = filters.sistema
    state.filtros["requerimientoTipo"] = filters.tipo
  },
  CLEAR_FILTROS: state => {
    state.filtros.sistema = null
    state.filtros.requerimientoTipo = null
    state.filtros.descripcion = null
  },
  SET_LOADING_REQUERIMIENTOS: (state, value) => {
    state.loadingRequerimientos = value
  },
  PUSHER_UPDATE_REQUERIMIENTO: (state, { operation, req }) => {
    switch (operation) {
      case "addOrUpdate": {
        // Chequeo si lo encuentra en el listdo. Si lo encuentra, actualiza. Si no, lo agrega
        const removedIndex = _.findIndex(state.requerimientos, {
          id: req.id,
        })
        if (removedIndex !== -1) {
          state.requerimientos.splice(removedIndex, 1, new Requerimiento(req))
        } else {
          state.requerimientos.push(new Requerimiento(req))
        }
        break
      }
      case "update": {
        const removedIndex = _.findIndex(state.requerimientos, {
          id: req.id,
        })
        if (removedIndex !== -1) {
          state.requerimientos.splice(removedIndex, 1, new Requerimiento(req))
        }
        break
      }
      case "delete": {
        const removedIndex = _.findIndex(state.requerimientos, {
          id: req.id,
        })
        if (removedIndex !== -1) {
          state.requerimientos.splice(removedIndex, 1)
        }
        break
      }
    }
  },
}

const actions = {
  inicializarRequerimientosAsignados({ commit, rootGetters }) {
    const currentUserId = rootGetters["auth/userId"]
    // dispatch("getRequerimientosAsignadosByUser", {
    //   userId: currentUserId,
    // })
    commit("SET_LOADING_REQUERIMIENTOS", true)
    return getRequerimientosAsignadosByUser(currentUserId)
      .then(data => {
        commit("SET_REQS_LIST", data)
      })
      .catch(e => console.log(e))
      .finally(() => {
        commit("SET_LOADING_REQUERIMIENTOS", false)
      })
  },
  // getRequerimientosAsignadosByUser({ commit }, { userId }) {
  //
  // },
  processUpdateList({ commit, getters, dispatch }, updatedListData) {
    // console.log(getters.operationType)
    return new Promise(async (resolve, reject) => {
      // updatea los listados temporales
      commit("PROCESS_UPDATE_LISTS", updatedListData)

      if (!getters.possibleChangesSetted) {
        resolve()
        return
      }
      if (getters.operationWrongFromTesting) {
        reject({
          message:
            "Para quitar este requerimiento de testing, ingresa al detalle y seleccione la acción correspondiente",
        })
        commit("CLEAR_OPERATIONS")
        return
      }
      if (getters.operationWrongToTesting) {
        reject({
          message: "El requerimiento debe estar en ejecución para poder enviar a testing",
        })
        commit("CLEAR_OPERATIONS")
        return
      }
      if (getters.isPaused) {
        reject({
          message: "El requerimiento se encuentra PAUSADO",
        })
        commit("CLEAR_OPERATIONS")
        return
      }

      switch (getters.operationType) {
        case "execute":
        case "pending":
        case "test":
          // se setea el requerimiento abierto en el store y luego se abre el modal de confirmacion
          await dispatch(
            "requerimientos/setDetalleRequerimiento",
            {
              reqId: getters.requerimientoIdToChange,
              listName: "requerimientos-asignados",
            },
            { root: true },
          )
          dispatch("setDialogConfirmOperationOpen", true)
          break
      }
      resolve()
    })
  },

  setDialogConfirmOperationOpen({ commit, dispatch }, value = true) {
    commit("SET_DIALOG_CONFIRM_OPERATION_OPEN", value)
    if (!value) {
      dispatch("clearOperations")
      commit("requerimientos/SET_DETALLE_REQUERIMIENTO_ITEM", null, { root: true })
    }
  },

  clearOperations({ commit }) {
    return new Promise(resolve => {
      commit("CLEAR_OPERATIONS")
      resolve()
    })
  },

  processManualChanges(
    { commit, dispatch, rootState, rootGetters },
    { operation, comment, horasEstimadas, usuarioTesting, sistemaId },
  ) {
    return new Promise(async (resolve, reject) => {
      let requerimientoItem = _.get(rootState, "requerimientos.detalleRequerimientoItem", null)

      try {
        dispatch("app/loadingInc", null, { root: true })
        switch (operation) {
          case "finalizar":
          case "finalizarYEnviar": {
            if (operation === "finalizar") {
              await finalizarRequerimiento(requerimientoItem.id, {
                horas_ejecucion: horasEstimadas,
                comentario: comment,
              })
            } else if (operation === "finalizarYEnviar") {
              await finalizarRequerimiento(requerimientoItem.id, {
                horas_ejecucion: horasEstimadas,
                comentario: comment,
                sistema_id: sistemaId,
              })
            }

            // dispatch("app/getDashboardData", null, { root: true })
            commit("UPDATE_REQ_ESTADO_FINISH", requerimientoItem.id)
            resolve()
            break
          }
          case "ejecucion": {
            await ejecutarRequerimiento(requerimientoItem.id)
            commit("UPDATE_REQ_ESTADO_INEXCEC", requerimientoItem.id)
            commit("CLEAR_OPERATIONS")
            resolve()
            break
          }
          case "volverPendiente": {
            await cancelaEjecucionRequerimiento(requerimientoItem.id, {
              comentario: comment,
            })
            commit("UPDATE_REQ_ESTADO_ASSIGNED", requerimientoItem.id)
            commit("CLEAR_OPERATIONS")
            resolve()
            break
          }
          case "testing": {
            await enviarATestingRequerimiento(requerimientoItem.id, {
              usuario_asignado: usuarioTesting.value,
              comentario: comment,
            })
            // dispatch("app/getDashboardData", null, { root: true })
            commit("UPDATE_REQ_ESTADO_TESTING", {
              reqId: requerimientoItem.id,
              usuarioTesting,
            })
            commit("CLEAR_OPERATIONS")
            resolve()
            break
          }
          case "pausar": {
            await pausarRequerimiento(requerimientoItem.id, {
              comentario: comment,
            })
            commit("UPDATE_REQ_ESTADO_PAUSED", {
              reqId: requerimientoItem.id,
              paused: true,
            })
            commit("CLEAR_OPERATIONS")
            resolve()
            break
          }
          case "reanudar": {
            await reanudarRequerimiento(requerimientoItem.id, {
              comentario: comment,
            })
            commit("UPDATE_REQ_ESTADO_PAUSED", {
              reqId: requerimientoItem.id,
              paused: false,
            })
            commit("CLEAR_OPERATIONS")
            resolve()
            break
          }
          case "devolverADesarrollo": {
            await cancelarTestingRequerimiento(requerimientoItem.id, {
              comentario: comment,
            })
            // si yo SI soy el asignado al req, debo cambiar el estado y sacar el usuario_testing
            const currentUserId = rootGetters["auth/userId"]
            const reqUsuarioId = requerimientoItem.estado.asignacion.usuario_id
            if (currentUserId === reqUsuarioId) {
              commit("UPDATE_REQ_ESTADO_ASSIGNED", requerimientoItem.id)
            }
            // si yo NO soy el asignado al req, debo BORRARLO del array de requerimientos, sino va a ir a parar a mi panel
            else {
              commit("UPDATE_REQ_ESTADO_FINISH", requerimientoItem.id)
            }
            // dispatch("app/getDashboardData", null, { root: true })
            resolve()
            break
          }
        }
      } catch (e) {
        reject(e)
      } finally {
        dispatch("app/loadingDec", null, { root: true })
      }
    })
  },
  setFilter({ commit }, { filter, value }) {
    return new Promise(resolve => {
      commit("SET_FILTRO", { filter, value })
      resolve()
    })
  },
  setFilters({ commit }, filters) {
    return new Promise(resolve => {
      commit("SET_FILTROS", filters)
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
