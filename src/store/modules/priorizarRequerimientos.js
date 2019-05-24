import RequerimientosPriorizarList from "@models/RequerimientosPriorizarList"
import {
  getRequerimientosByUserAndEstado,
  // updateRequerimientosEstados,
} from "@api/requerimientos"

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
  approveComment: "",
  detalleRequerimientoOpen: true,
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
}

const mutations = {
  SET_REQS_LIST: (state, { listType, listData }) => {
    listType === "pending"
      ? (state.reqsPendientesAprobacion.list = listData)
      : (state.reqsAprobadosPriorizados.list = listData)
  },
  SORT_LIST_BY_PRIORITY: (state, listType) => {
    listType === "pending"
      ? state.reqsPendientesAprobacion.sortByPrioridad()
      : state.reqsAprobadosPriorizados.sortByPrioridad()
  },
  SET_LOADING_STATE_REQS_LISTS: (state, { listType, loadingState }) => {
    listType === "pending"
      ? (state.loadingReqsPendientesAprobacion = loadingState)
      : (state.loadingReqsAprobadosPriorizados = loadingState)
  },
  SET_POSSIBLE_CHANGES: (state, path, value) => {
    _.set(state.possibleChanges, path, value)
  },
  SET_DIALOG_CONFIRM_OPERATION_OPEN: (state, value) => {
    state.dialogConfirmOpen = value
  },
  SET_APPROVE_COMMENT: (state, value) => {
    state.approveComment = value
  },
  SET_DETALLE_REQ_OPEN: (state, value) => {
    state.detalleRequerimientoOpen = value
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
    state.approveComment = ""
    state.dialogConfirmOpen = false
  },
  PROCESS_UPDATE_LISTS: (state, listName, listResult, dropResult) => {
    const { removedIndex, addedIndex, payload } = dropResult
    state.possibleChanges[`${listName}List`] = listResult
    state.possibleChanges[`${listName}Changes`] = {
      addedIndex,
      removedIndex,
      changesSetted: true, // seteo que hubo cambios en este listado
    }
    state.possibleChanges.payload = payload
  },
}

const actions = {
  getRequerimientosByUserAndEstado(
    { commit, rootGetters },
    { userId, reqState },
  ) {
    const estadoReq = rootGetters["requerimientos/getEstadoByCodigo"](reqState)
    const listType = reqState === "PEND" ? "pending" : "approved"

    commit("SET_LOADING_STATE_REQS_LISTS", listType, true)
    return getRequerimientosByUserAndEstado(userId, estadoReq.id)
      .then(({ data: { data } }) => {
        commit("SET_REQS_LIST", { listType, listData: data })
        commit("SORT_LIST_BY_PRIORITY", listType)
      })
      .catch(e => console.log(e))
      .finally(() => {
        commit("SET_LOADING_STATE_REQS_LISTS", listType, false)
      })
  },
  /* processUpdateList({ commit }, listName, listResult, dropResult) {
    const { removedIndex, addedIndex, payload } = dropResult
    this.possibleChanges[`${listName}List`] = listResult
    this.possibleChanges[`${listName}Changes`] = {
      addedIndex,
      removedIndex,
      changesSetted: true, // seteo que hubo cambios en este listado
    }
    this.$set(this.possibleChanges, "payload", payload)
  }, */

  action(/*{ commit, state }*/) {
    return new Promise(async (/* resolve, reject */) => {})
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
