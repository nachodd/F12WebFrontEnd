import RequerimientosPriorizarList from "@models/RequerimientosPriorizarList"
import {
  getRequerimientosByUserAndEstado,
  updateRequerimientosEstados,
} from "@api/requerimientos"
import { warn, success } from "@utils/helpers"
import Requerimiento from "@models/requerimiento"

const state = {
  reqsPendientesAprobacion: new RequerimientosPriorizarList([], false),
  reqsAprobadosPriorizados: new RequerimientosPriorizarList([], true),

  loadingReqsPendientesAprobacion: false,
  loadingReqsAprobadosPriorizados: false,

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

  detalleRequerimientoOpen: false,
  detalleRequerimientoItem: null,
}

const getters = {
  requerimientoIdToChange: state =>
    _.get(state.possibleChanges.payload, "id", ""),
  // Los cambios estaran seteados si: fueron seteados los 2 listados y el payload
  // o si fue seteado el source Y es el ultimo de la cadena de mando (si es así, solo tiene ese listado)
  possibleChangesSetted: (state, getters, rootState, rootGetters) => {
    const esElUltimoDeLaCadenaDeMando =
      rootGetters["auth/esElUltimoDeLaCadenaDeMando"]
    return (
      (state.possibleChanges.sourceChanges.changesSetted &&
        state.possibleChanges.targetChanges.changesSetted &&
        state.possibleChanges.payload.id &&
        !esElUltimoDeLaCadenaDeMando) ||
      (state.possibleChanges.sourceChanges.changesSetted &&
        state.possibleChanges.payload.id &&
        esElUltimoDeLaCadenaDeMando)
    )
  },
  // - reordenamiento de la lista de pendientes => no hace nada (a menos que esElUltimoDeLaCadenaDeMando=true)
  operationReoderPendingList: state => {
    const { sourceChanges, targetChanges } = state.possibleChanges
    return (
      targetChanges.removedIndex === null &&
      targetChanges.addedIndex === null &&
      sourceChanges.removedIndex !== null &&
      sourceChanges.addedIndex !== null
    )
  },
  // - reordenamiento de la lista de aprobados => disparar update aprobados
  operationReoderApprovedList: state => {
    const { sourceChanges, targetChanges } = state.possibleChanges
    return (
      targetChanges.removedIndex !== null &&
      targetChanges.addedIndex !== null &&
      sourceChanges.removedIndex === null &&
      sourceChanges.addedIndex === null
    )
  },
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
    if (
      getters.operationReoderPendingList &&
      !getters.operationReoderApprovedList &&
      !getters.operationApprove &&
      !getters.operationReject
    ) {
      return "reorder-pending"
    } else if (
      !getters.operationReoderPendingList &&
      getters.operationReoderApprovedList &&
      !getters.operationApprove &&
      !getters.operationReject
    ) {
      return "reorder-approved"
    } else if (
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
  differentPositionsSource: state => {
    return (
      state.possibleChanges.sourceChanges.addedIndex !==
      state.possibleChanges.sourceChanges.removedIndex
    )
  },
  differentPositionsTarget: state => {
    return (
      state.possibleChanges.targetChanges.addedIndex !==
      state.possibleChanges.targetChanges.removedIndex
    )
  },
}

const mutations = {
  SET_REQS_LIST: (state, { listType, listData }) => {
    listType === "pending"
      ? (state.reqsPendientesAprobacion.list = listData)
      : (state.reqsAprobadosPriorizados.list = listData)
  },
  SORT_LIST_BY_PRIORITY: (state, listType) => {
    // Obtengo la lista
    let list =
      listType === "pending"
        ? [...state.reqsPendientesAprobacion.list]
        : [...state.reqsAprobadosPriorizados.list]

    list = _.sortBy(list, ["prioridad"])

    // Persisto los cambios localmente
    listType === "pending"
      ? (state.reqsPendientesAprobacion.list = list)
      : (state.reqsAprobadosPriorizados.list = list)
  },
  UPDATE_LIST_PRIORITY: (state, listType) => {
    // Obtengo la lista
    let list =
      listType === "pending"
        ? [...state.reqsPendientesAprobacion.list]
        : [...state.reqsAprobadosPriorizados.list]
    // Actualizo la prioridad por indice (orden)
    list = list.map((req, index) => {
      req.prioridad = index + 1
      return req
    })
    // Persisto los cambios localmente
    listType === "pending"
      ? (state.reqsPendientesAprobacion.list = list)
      : (state.reqsAprobadosPriorizados.list = list)
  },
  UPDATE_LIST_ESTADO: (state, listType) => {
    let list =
      listType === "pending"
        ? [...state.reqsPendientesAprobacion.list]
        : [...state.reqsAprobadosPriorizados.list]
    // Mapeo el valor del estado aca, porque si se produce un cambio de estado local
    // (de pendiente a aprobado y vicerversa) el nuevo listado va a tener el valor correcto en el campo estado
    list = list.map(req => {
      if (listType === "approved") {
        req.estado = { id: 2, descripcion: "Aprobado" }
      } else {
        req.estado = { id: 1, descripcion: "Pendiente aprobación" }
      }
      return req
    })
    // Persisto los cambios localmente
    listType === "pending"
      ? (state.reqsPendientesAprobacion.list = list)
      : (state.reqsAprobadosPriorizados.list = list)
  },
  SET_LOADING_STATE_REQS_LISTS: (state, { listType, loadingState }) => {
    listType === "pending"
      ? (state.loadingReqsPendientesAprobacion = loadingState)
      : (state.loadingReqsAprobadosPriorizados = loadingState)
  },
  SET_POSSIBLE_CHANGES: (state, { path, value }) => {
    _.set(state.possibleChanges, path, value)
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
  UPDATE_COMMENT_IN_REQ: (state, { listName, reqId, comment }) => {
    _.find(state.possibleChanges[listName], {
      id: reqId,
    }).comentario = comment
  },
  SET_DETALLE_REQUERIMIENTO_ITEM: (state, requerimiento) => {
    if (requerimiento) {
      state.detalleRequerimientoItem = new Requerimiento(requerimiento)
      // state.detalleRequerimientoItem = Object.assign(
      //   {},
      //   state.detalleRequerimientoItem,
      //   new Requerimiento(requerimiento),
      // )
    } else {
      state.detalleRequerimientoItem = null
    }
  },
  SET_DETALLE_REQUERIMIENTO_OPEN: (state, value) => {
    state.detalleRequerimientoOpen = value
  },
}

const actions = {
  inicializarPriorizarRequerimientos({ dispatch, rootGetters }) {
    const esElUltimoDeLaCadenaDeMando =
      rootGetters["auth/esElUltimoDeLaCadenaDeMando"]
    const currentUserId = rootGetters["auth/userId"]

    dispatch("getRequerimientosByUserAndEstado", {
      userId: currentUserId,
      reqState: "PEND",
    })

    if (!esElUltimoDeLaCadenaDeMando) {
      dispatch("getRequerimientosByUserAndEstado", {
        userId: currentUserId,
        reqState: "APRV",
      })
    }
  },
  getRequerimientosByUserAndEstado(
    { commit, rootGetters },
    { userId, reqState },
  ) {
    const estadoReq = rootGetters["requerimientos/getEstadoByCodigo"](reqState)
    const listType = reqState === "PEND" ? "pending" : "approved"

    commit("SET_LOADING_STATE_REQS_LISTS", { listType, loadingState: true })

    return getRequerimientosByUserAndEstado(userId, estadoReq.id)
      .then(({ data: { data } }) => {
        commit("SET_REQS_LIST", { listType, listData: data })
        commit("UPDATE_LIST_ESTADO", listType)
        commit("SORT_LIST_BY_PRIORITY", listType)
      })
      .catch(e => console.log(e))
      .finally(() => {
        commit("SET_LOADING_STATE_REQS_LISTS", {
          listType,
          loadingState: false,
        })
      })
  },
  processUpdateList({ commit, getters, dispatch }, updatedListData) {
    return new Promise(resolve => {
      // Updateo los listados temporales
      commit("PROCESS_UPDATE_LISTS", updatedListData)

      // Chequeo si
      //  - si esElUltimoDeLaCadenaDeMando===false => si AMBOS listados temporales fueron seteados los cambios
      //  - si esElUltimoDeLaCadenaDeMando===true, => si SOLO en el listado temporal de pendientes (source) fueron seteados los cambios
      if (!getters.possibleChangesSetted) {
        return
      }

      switch (getters.operationType) {
        case "reorder-pending":
          dispatch("saveReorderPending")
          break
        case "reorder-approved":
          dispatch("saveReorderApproved")
          break
        case "approve":
        case "reject":
          dispatch("setDialogConfirmOperationOpen", true)
          break
      }
      resolve()
    })
  },
  saveReorderPending({ commit, state, getters, rootGetters, dispatch }) {
    return new Promise(async resolve => {
      const esElUltimoDeLaCadenaDeMando =
        rootGetters["auth/esElUltimoDeLaCadenaDeMando"]
      const listType = "pending"
      // Si es el ultimo de la cadena de mando, los cambios en el orden (prioridad) se deben persistir
      if (esElUltimoDeLaCadenaDeMando) {
        // valido si efecivamente si hizo un cambio: Si el addedIndex y removedIndex son iguales, no se movio nada en la lista
        if (getters.differentPositionsSource) {
          const sourceBackup = [...state.reqsPendientesAprobacion.list]
          // Actualizo con los cambios en la lista del store local
          commit("SET_REQS_LIST", {
            listType,
            listData: state.possibleChanges.sourceList,
          })
          commit("UPDATE_LIST_PRIORITY", listType)
          commit("UPDATE_LIST_ESTADO", listType)
          // Persisto los cambios en el remoto y si no gurado correctamente, reviertos los cambios
          const res = await dispatch(
            "persistChanges",
            state.reqsPendientesAprobacion.toUpdatePendingPayload(),
          )
          if (!res) {
            commit("SET_REQS_LIST", {
              listType,
              listData: sourceBackup,
            })
            commit("UPDATE_LIST_ESTADO", listType)
          }
        }
      } else {
        // actualizo localmente, aunque el cambio no es persistido
        commit("SET_REQS_LIST", {
          listType,
          listData: state.possibleChanges.sourceList,
        })
        commit("UPDATE_LIST_ESTADO", listType)
      }
      commit("CLEAR_OPERATIONS")
      resolve()
    })
  },
  saveReorderApproved({ commit, state, getters, dispatch }) {
    return new Promise(async resolve => {
      const listType = "approved"
      // valido si efecivamente si hizo un cambio: Si el addedIndex y removedIndex son iguales, no se movio nada en la lista
      if (getters.differentPositionsTarget) {
        const targetBackup = [...state.reqsAprobadosPriorizados.list]
        // Actualizo con los cambios en la lista del store local
        commit("SET_REQS_LIST", {
          listType,
          listData: state.possibleChanges.targetList,
        })
        commit("UPDATE_LIST_PRIORITY", listType)
        commit("UPDATE_LIST_ESTADO", listType)
        // Persisto los cambios en el remoto y si no gurado correctamente, reviertos los cambios
        const res = await dispatch(
          "persistChanges",
          state.reqsAprobadosPriorizados.toUpdatePayload(),
        )
        if (!res) {
          commit("SET_REQS_LIST", {
            listType,
            listData: targetBackup,
          })
          commit("UPDATE_LIST_ESTADO", listType)
        }
      }
      commit("CLEAR_OPERATIONS")
      resolve()
    })
  },
  async confirmOperation({ commit, getters, state, dispatch }, comment) {
    return new Promise(async resolve => {
      const reqId = getters.requerimientoIdToChange
      // copio los listados (de manera de tener un backup)
      const sourceBackup = [...state.reqsPendientesAprobacion.list]
      const targetBackup = [...state.reqsAprobadosPriorizados.list]

      // Actualizo el comentario
      let listToUpdateComment = getters.operationReject
        ? "sourceList"
        : "targetList"
      commit("UPDATE_COMMENT_IN_REQ", {
        listName: listToUpdateComment,
        reqId,
        comment,
      })

      // Actualizo localmente los listados
      commit("SET_REQS_LIST", {
        listType: "pending",
        listData: state.possibleChanges.sourceList,
      })
      commit("UPDATE_LIST_ESTADO", "pending")
      commit("SET_REQS_LIST", {
        listType: "approved",
        listData: state.possibleChanges.targetList,
      })
      commit("UPDATE_LIST_ESTADO", "approved")
      commit("UPDATE_LIST_PRIORITY", "approved")
      commit("SORT_LIST_BY_PRIORITY", "approved")

      const tempReqsConcated = [
        ...state.reqsPendientesAprobacion.toUpdatePayload(),
        ...state.reqsAprobadosPriorizados.toUpdatePayload(),
      ]
      // Persisto los cambios en el remoto y si no gurado correctamente, reviertos los cambios
      const res = await dispatch("persistChanges", tempReqsConcated)
      if (!res) {
        commit("SET_REQS_LIST", {
          listType: "pending",
          listData: sourceBackup,
        })
        commit("UPDATE_LIST_ESTADO", "pending")
        commit("SET_REQS_LIST", {
          listType: "approved",
          listData: targetBackup,
        })
        commit("UPDATE_LIST_ESTADO", "approved")
      }

      resolve()
    })
  },
  setDialogConfirmOperationOpen({ commit }, value = true) {
    commit("SET_DIALOG_CONFIRM_OPERATION_OPEN", value)
  },
  async persistChanges({ dispatch, getters, rootGetters }, list) {
    try {
      const userId = rootGetters["auth/userId"]
      dispatch("app/loadingInc", null, { root: true })
      await updateRequerimientosEstados(userId, list)

      let message = ""
      switch (getters.operationType) {
        case "reorder-pending":
          message = "Requerimientos PRIORIZADOS"
          break
        case "reorder-approved":
          message = "Requerimientos aprobados PRIORIZADOS"
          break
        case "approve":
          message = `Requerimiento #${this.requerimientoIdToChange} APROBADO`
          break
        case "reject":
          message = `Requerimiento #${
            getters.requerimientoIdToChange
          } marcado como "PEND. DE APROBACIÓN"`
          break
      }
      success({ message })
      return true
    } catch (e) {
      const message =
        e.message ||
        "Hubo un problema al cambiar el estado de los Requerimientos. Intente nuevamente más tarde"
      warn({ message })
      return false
    } finally {
      dispatch("app/loadingDec", null, { root: true })
    }
  },
  clearOperations({ commit }) {
    return new Promise(resolve => {
      commit("CLEAR_OPERATIONS")
      resolve()
    })
  },
  abrirDetalleRequerimiento({ commit, state }, { reqId, listName }) {
    return new Promise(async (/* resolve, reject */) => {
      console.log(reqId, listName)
      // Para seguir con la convencion de nombres, utilizo listType para la action
      const listType = listName === "source" ? "pending" : "approved"
      let list =
        listType === "pending"
          ? state.reqsPendientesAprobacion.list
          : state.reqsAprobadosPriorizados.list

      const requerimiento = _.find(list, { id: reqId })
      if (requerimiento) {
        commit("SET_DETALLE_REQUERIMIENTO_ITEM", requerimiento)
      } else {
        commit("SET_DETALLE_REQUERIMIENTO_ITEM", null)
        // state.detalleRequerimientoItem = null
      }

      if (state.detalleRequerimientoItem) {
        commit("SET_DETALLE_REQUERIMIENTO_OPEN", true)
      }
    })
  },
  setDetalleRequerimientoOpen({ commit }, value) {
    return new Promise(resolve => {
      commit("SET_DETALLE_REQUERIMIENTO_OPEN", value)
      // si está cerrando, borro el requerimiento detalle
      if (!value) {
        commit("SET_DETALLE_REQUERIMIENTO_ITEM", null)
      }
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
