import RequerimientosAsignadosList from "src/models/RequerimientosAsignadosList"
import {
  getRequerimientosAsignadosByUser,
  ejecutarRequerimiento,
  cancelaEjecucionRequerimiento,
  finalizarRequerimiento,
  enviarATestingRequerimiento,
  pausarRequerimiento,
  reanudarRequerimiento,
} from "@api/requerimientos"
import {
  filterByAsuntoAndDescripcion,
  filterBySistema,
  filterByTipoRequerimiento,
  // filterByUsuariosAsignados,
  // UpdatePendingPayloadPriorizarReq,
} from "@utils/requerimientos"
import { pipeWith } from "@utils/helpers"

const state = {
  requerimientos: [],
  changesRequerimientos: [],
  loadingRequerimientos: false,

  reqsAsignadosPendientes: new RequerimientosAsignadosList([], true),
  reqsAsignadosEnEjecucion: new RequerimientosAsignadosList([], true),
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
  },
  filtros: {
    sistema: null,
    requerimientoTipo: null,
    descripcion: null,
  },
}

const getters = {
  requerimientoIdToChange: state =>
    _.get(state.possibleChanges.payload, "id", ""),
  // Los cambios estaran seteados si: fueron seteados los 2 listados y el payload
  // o si fue seteado el source Y es el ultimo de la cadena de mando (si es así, solo tiene ese listado)
  possibleChangesSetted: state => {
    return (
      state.possibleChanges.sourceChanges.changesSetted &&
      state.possibleChanges.targetChanges.changesSetted &&
      Boolean(state.possibleChanges.payload.id)
      //  ||
      // (state.possibleChanges.sourceChanges.changesSetted &&
      //   Boolean(state.possibleChanges.payload.id))
    )
  },
  // // - reordenamiento de la lista de pendientes => no hace nada (a menos que esElUltimoDeLaCadenaDeMando=true)
  // operationReoderPendingList: state => {
  //   const { sourceChanges, targetChanges } = state.possibleChanges
  //   return (
  //     targetChanges.removedIndex === null &&
  //     targetChanges.addedIndex === null &&
  //     sourceChanges.removedIndex !== null &&
  //     sourceChanges.addedIndex !== null
  //   )
  // },
  // // - reordenamiento de la lista de aprobados => disparar update aprobados
  // operationReoderApprovedList: state => {
  //   const { sourceChanges, targetChanges } = state.possibleChanges
  //   return (
  //     targetChanges.removedIndex !== null &&
  //     targetChanges.addedIndex !== null &&
  //     sourceChanges.removedIndex === null &&
  //     sourceChanges.addedIndex === null
  //   )
  // },
  // - arrastrar de pendientes a aprobados => confirmar y disparar update aprobados y pendientes
  operationApprove: state => {
    const { sourceChanges, targetChanges } = state.possibleChanges
    return (
      targetChanges.removedIndex === null &&
      targetChanges.addedIndex !== null &&
      sourceChanges.removedIndex !== null &&
      sourceChanges.addedIndex === null
    )
  },
  // - arrastrar de aprobados a pendientes => confirmar y disparar update aprobados y pendientes
  operationReject: state => {
    const { sourceChanges, targetChanges } = state.possibleChanges
    return (
      targetChanges.removedIndex !== null &&
      targetChanges.addedIndex === null &&
      sourceChanges.removedIndex === null &&
      sourceChanges.addedIndex !== null
    )
  },
  operationType: (state, getters) => {
    // if (
    //   getters.operationReoderPendingList &&
    //   !getters.operationReoderApprovedList &&
    //   !getters.operationApprove &&
    //   !getters.operationReject
    // ) {
    //   return "reorder-pending"
    // } else if (
    //   !getters.operationReoderPendingList &&
    //   getters.operationReoderApprovedList &&
    //   !getters.operationApprove &&
    //   !getters.operationReject
    // ) {
    //   return "reorder-approved"
    // } else
    if (
      !getters.operationReoderPendingList &&
      !getters.operationReoderApprovedList &&
      getters.operationApprove &&
      !getters.operationReject
    ) {
      return "approve"
    } else if (
      !getters.operationReoderPendingList &&
      !getters.operationReoderApprovedList &&
      !getters.operationApprove &&
      getters.operationReject
    ) {
      return "reject"
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
    return _.orderBy(
      reqsResult,
      ["estado.pausado", "estado.asignacion.orden"],
      ["asc", "asc"],
    )
  },
  requerimientosTesting: (state, getters, rootState, rootGetters) => {
    const estTesting = rootGetters["requerimientos/getEstadoByCodigo"]("TEST")
    const reqsResult = _.filter(state.requerimientos, {
      estado: { id: estTesting.id },
    })
    return _.orderBy(
      reqsResult,
      ["estado.asignacion_testing", "estado.asignacion.orden"],
      ["asc", "asc"],
    )
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
    const {
      descripcion = null,
      sistema = null,
      requerimientoTipo = null,
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
    // aplica a reqs el conjunto de filtros
    return pipeWith(reqs, ...filtersToApply)
  },
  getNewOrder: (state, getters) => {
    // Busca el requerimiento a actualizar en el listado que está en pantalla
    // const reqsAsignadosOnScreen = state.possibleChanges.targetList
    const reqsAsignadosOnScreen = state.possibleChanges.targetList
    const index = _.findIndex(reqsAsignadosOnScreen, {
      id: getters.requerimientoIdToChange,
    })
    // De estos, busco el siguiente en pantalla
    const nextReq = reqsAsignadosOnScreen[index + 1]

    if (nextReq) {
      // Si lo encuentra, devuelve su orden e indico que NO es el ultimo
      return {
        orden: nextReq.prioridad,
        ultimo: false,
      }
    } else {
      // Caso contario, determino el orden REAL
      let orden
      // Si no hay otros reqs asignados, orden = 1
      if (getters.getAprobadosPriorizados.length === 0) {
        orden = 1
      } else {
        // Busco el último reqs de los asignados, tomo su orden y le aumento 1
        const lastReq =
          getters.getAprobadosPriorizados[
            getters.getAprobadosPriorizados.length - 1
          ]
        orden = lastReq.prioridad + 1
      }
      // Será el ultimo (ya sea porque se filtro el listado y no hay nada o porque efectivametne no habia otro asignado)
      return {
        orden,
        ultimo: true,
      }
    }
  },
}

const mutations = {
  // SET_REQS_LIST: (state, { listName, listData }) => {
  //   state[`${listName}`].list = listData
  // },
  SET_REQS_LIST: (state, listData) => {
    state.requerimientos = [...listData]
    state.changesRequerimientos = [...listData]
  },
  PUSH_REQS_LIST: (state, { listData }) => {
    state.requerimientos.push(...listData)
    state.changesRequerimientos.push(...listData)
    state.requerimientos = _.sortBy(state.requerimientos, [
      "estado.asignacion.orden",
    ])
    state.changesRequerimientos = _.sortBy(state.changesRequerimientos, [
      "estado.asignacion.orden",
    ])
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
    for (const listName of ["source", "target"]) {
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

  UPDATE_LIST_ESTADO: (state, listType) => {
    let list = [...state[`${listType}`].list]

    // Mapeo el valor del estado aca, porque si se produce un cambio de estado local
    // (de pendiente a aprobado y vicerversa) el nuevo listado va a tener el valor correcto en el campo estado
    list = list.map(req => {
      if (listType === "reqsAsignadosEnEjecucion") {
        req.estado = { id: 5, descripcion: "En ejecución" }
      } else {
        req.estado = { id: 4, descripcion: "Asignado" }
      }
      return req
    })
    // Persisto los cambios localmente
    state[`${listType}`].list = list

    // listType === "reqsAsignadosPendientes"
    //   ? (state.reqsAsignadosPendientes.list = list)
    //   : (state.reqsAsignadosEnEjecucion.list = list)
  },

  UPDATE_REQ_ESTADO_ASSIGNED: (state, reqId) => {
    const req = state.changesRequerimientos.find(r => r.id === reqId)
    req.estado = { id: 4, descripcion: "Asignado" }
  },
  UPDATE_REQ_ESTADO_INEXCEC: (state, reqId) => {
    const req = state.changesRequerimientos.find(r => r.id === reqId)
    req.estado = { id: 5, descripcion: "En ejecución" }
  },
  UPDATE_REQ_ESTADO_TESTING: (state, reqId) => {
    const req = state.changesRequerimientos.find(r => r.id === reqId)
    req.estado = { id: 10, descripcion: "Testing" }
  },

  SET_FILTROS: (state, { filter, value }) => {
    state.filtros[filter] = value
  },
  CLEAR_FILTROS: state => {
    state.filtros.sistema = null
    state.filtros.requerimientoTipo = null
    state.filtros.descripcion = null
  },
  SET_LOADING_REQUERIMIENTOS: (state, value) => {
    state.loadingRequerimientos = value
  },
}

const actions = {
  inicializarRequerimientosAsignados({ dispatch, rootGetters }) {
    const currentUserId = rootGetters["auth/userId"]

    dispatch("getRequerimientosAsignadosByUser", {
      userId: currentUserId,
    })
  },

  getRequerimientosAsignadosByUser({ commit }, { userId }) {
    commit("SET_LOADING_REQUERIMIENTOS", true)
    return getRequerimientosAsignadosByUser(userId)
      .then(data => {
        commit("SET_REQS_LIST", data)
      })
      .catch(e => console.log(e))
      .finally(() => {
        commit("SET_LOADING_REQUERIMIENTOS", false)
      })
  },

  processUpdateList({ commit, getters, dispatch }, updatedListData) {
    // console.log(getters.operationType)
    return new Promise(resolve => {
      // updatea los listados temporales
      commit("PROCESS_UPDATE_LISTS", updatedListData)

      if (!getters.possibleChangesSetted) {
        return
      }

      // FIXME aca tampoco serian approve y rejet
      switch (getters.operationType) {
        // case "reorder-pending":
        //   dispatch("saveReorderPending")
        //   break
        // case "reorder-approved":
        //   dispatch("saveReorderApproved")
        //   break
        case "approve":
        case "reject":
          dispatch("setDialogConfirmOperationOpen", true)
          break
      }
      resolve()
    })
  },

  setDialogConfirmOperationOpen({ commit }, value = true) {
    commit("SET_DIALOG_CONFIRM_OPERATION_OPEN", value)
  },

  clearOperations({ commit }) {
    return new Promise(resolve => {
      commit("CLEAR_OPERATIONS")
      resolve()
    })
  },

  // async confirmOperation({ commit, getters, state, dispatch }, comment) {
  async confirmOperation({ commit, getters, state, dispatch }, comentario) {
    return new Promise(async (resolve, reject) => {
      const reqId = getters.requerimientoIdToChange
      // FIXME: cambiar la logica de esto para que primero haga la llamada al save, y si esta todo bien, recien ahí actualizo la vista
      // copio los listados (de manera de tener un backup)
      const sourceBackup = [...state.reqsAsignadosPendientes.list]
      const targetBackup = [...state.reqsAsignadosEnEjecucion.list]

      commit("SET_REQS_LIST", {
        listName: "reqsAsignadosPendientes",
        listData: state.possibleChanges.sourceList,
      })

      commit("SET_REQS_LIST", {
        listName: "reqsAsignadosEnEjecucion",
        listData: state.possibleChanges.targetList,
      })

      // FIXME: en vez de llamar a esta mutation, se podría llamar a otra que actualice SOLO el campo estado del req en cuestion (como la mutation asginacionRequerimientos/SET_ESTADO_REQUERIMIENTO)
      // actualiza todos los estados de las listas para que correspondan con la columna en la que estan.
      commit("UPDATE_LIST_ESTADO", "reqsAsignadosEnEjecucion")
      commit("UPDATE_LIST_ESTADO", "reqsAsignadosPendientes")

      try {
        dispatch("app/loadingInc", null, { root: true })

        // Persisto los cambios en el remoto.
        if (getters.operationApprove) {
          await ejecutarRequerimiento(reqId)
        } else {
          await cancelaEjecucionRequerimiento(reqId, { comentario })
        }

        resolve()
      } catch (e) {
        //si no guardo correctamente, revierto los cambios.
        // pendientes
        commit("SET_REQS_LIST", {
          listName: "reqsAsignadosPendientes",
          listData: sourceBackup,
        })
        commit("UPDATE_LIST_ESTADO", "reqsAsignadosPendientes")

        // En ejecucion
        commit("SET_REQS_LIST", {
          listName: "reqsAsignadosEnEjecucion",
          listData: targetBackup,
        })

        commit("UPDATE_LIST_ESTADO", "reqsAsignadosEnEjecucion")
        reject(e)
      } finally {
        dispatch("app/loadingDec", null, { root: true })
      }

      resolve()
    })
  },

  processManualChanges(
    { commit, state, dispatch, rootState },
    { operation, priority, comment, listName, horasEstimadas, usuarioTesting },
  ) {
    return new Promise(async (resolve, reject) => {
      // Esta funcion arma manualmente los listados de requerimientos (como si hiciese un drag&drop) y emite los cambios

      let requerimientoItem = _.get(
        rootState,
        "requerimientos.detalleRequerimientoItem",
        null,
      )

      switch (operation) {
        case "finalizar": {
          try {
            dispatch("app/loadingInc", null, { root: true })
            const removedIndexTarget = _.findIndex(
              state.reqsAsignadosEnEjecucion.list,
              { id: requerimientoItem.id },
            )
            let listResultTarget = [...state.reqsAsignadosEnEjecucion.list]
            listResultTarget.splice(removedIndexTarget, 1)[0]

            // genera persistencia de los cambios
            await finalizarRequerimiento(requerimientoItem.id, {
              horas_ejecucion: horasEstimadas,
            })
            commit("SET_REQS_LIST", { listName, listData: listResultTarget })
            resolve()
          } catch (e) {
            reject(e)
          } finally {
            dispatch("app/loadingDec", null, { root: true })
          }

          break
        }
        case "ejecucion": {
          try {
            dispatch("app/loadingInc", null, { root: true })
            await ejecutarRequerimiento(requerimientoItem.id)
            // pendientes
            const removedIndexSource = _.findIndex(
              state.reqsAsignadosPendientes.list,
              { id: requerimientoItem.id },
            )
            let listResultSource = [...state.reqsAsignadosPendientes.list]
            const payload = listResultSource.splice(removedIndexSource, 1)[0]

            commit("SET_REQS_LIST", {
              listName: "reqsAsignadosPendientes",
              listData: listResultSource,
            })
            commit("UPDATE_LIST_ESTADO", "reqsAsignadosPendientes")

            // Ejecucion
            const addedIndexTarget = priority - 1
            // lista target: se inserta el item en el listado
            let listResultTarget = [...state.reqsAsignadosEnEjecucion.list]
            listResultTarget.splice(addedIndexTarget, 0, payload)

            commit("SET_REQS_LIST", {
              listName: "reqsAsignadosEnEjecucion",
              listData: listResultTarget,
            })
            commit("UPDATE_LIST_ESTADO", "reqsAsignadosEnEjecucion")
            commit("CLEAR_OPERATIONS")

            resolve()
          } catch (e) {
            reject(e)
          } finally {
            dispatch("app/loadingDec", null, { root: true })
          }

          break
        }
        case "volverPendiente": {
          try {
            dispatch("app/loadingInc", null, { root: true })
            await cancelaEjecucionRequerimiento(requerimientoItem.id, {
              comentario: comment,
            })

            // CAMBIOS EN EL Target: Se saca el item del listado
            const removedIndexTarget = _.findIndex(
              state.reqsAsignadosEnEjecucion.list,
              { id: requerimientoItem.id },
            )
            let listResultTarget = [...state.reqsAsignadosEnEjecucion.list]
            const payload = listResultTarget.splice(removedIndexTarget, 1)[0]

            commit("SET_REQS_LIST", {
              listName: "reqsAsignadosEnEjecucion",
              listData: listResultTarget,
            })
            commit("UPDATE_LIST_ESTADO", "reqsAsignadosEnEjecucion")

            // CAMBIOS EN EL SOURCE: se inserta el item en el listado
            const addedIndexSource = 0
            let listResultSource = [...state.reqsAsignadosPendientes.list]
            listResultSource.splice(addedIndexSource, 0, payload)

            commit("SET_REQS_LIST", {
              listName: "reqsAsignadosPendientes",
              listData: listResultSource,
            })

            commit("UPDATE_LIST_ESTADO", "reqsAsignadosPendientes")
            commit("CLEAR_OPERATIONS")
            resolve()
          } catch (e) {
            reject(e)
          } finally {
            dispatch("app/loadingDec", null, { root: true })
          }
          break
        }
        case "testing": {
          try {
            dispatch("app/loadingInc", null, { root: true })
            await enviarATestingRequerimiento(requerimientoItem.id, {
              usuario_asignado: usuarioTesting.value,
              comentario: comment,
            })
            // FIXME: faltaría cambiar de estado el req y eso
            resolve()
          } catch (e) {
            reject(e)
          } finally {
            dispatch("app/loadingDec", null, { root: true })
          }
          break
        }
        case "pausar":
        case "reanudar": {
          try {
            dispatch("app/loadingInc", null, { root: true })
            // FIXME: alterar el requermiento en el listado, setear estado.pausado: true
            if (operation === "pausar") {
              await pausarRequerimiento(requerimientoItem.id)
            } else if (operation === "reanudar") {
              await reanudarRequerimiento(requerimientoItem.id)
            }
            resolve()
          } catch (e) {
            reject(e)
          } finally {
            dispatch("app/loadingDec", null, { root: true })
          }
          break
        }
      }
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
