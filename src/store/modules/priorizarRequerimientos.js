// import RequerimientosPriorizarList from "models/requerimientosPriorizarList"
// import Requerimiento from "models/requerimiento"

import {
  getRequerimientosByUserAndEstado,
  updateRequerimientosEstados,
  refuseRequerimiento,
  deleteRequerimiento,
  // getRequerimiento,
} from "api/requerimientos"
import {
  filterByAsuntoAndDescripcion,
  filterBySistema,
  filterByTipoRequerimiento,
  // filterByUsuariosAsignados,
  UpdatePendingPayloadPriorizarReq,
} from "utils/requerimientos"
import { warn, success, pipeWith } from "utils/helpers"
// import vuelidate from "src/boot/vuelidate"
// import { runInNewContext } from "vm"

const state = {
  requerimientos: [],
  changesRequerimientos: [],

  // reqsPendientesAprobacion: new RequerimientosPriorizarList([], false),
  // reqsAprobadosPriorizados: new RequerimientosPriorizarList([], true),

  loadingReqsPendientesAprobacion: false,
  loadingReqsAprobadosPriorizados: false,

  dialogConfirmOpen: false,
  usuarioImpersonateId: null,
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
    // usuariosAsignados: [],
  },
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
  cantidadRequerimientos: (state, getters, rootState, rootGetters) => {
    const esElUltimoDeLaCadenaDeMando =
      rootGetters["auth/esElUltimoDeLaCadenaDeMando"]

    if (esElUltimoDeLaCadenaDeMando) {
      // return state.reqsPendientesAprobacion.listLength + 1
      return getters.requerimientosFiltered("PEND").length + 1
    } else {
      // return state.reqsAprobadosPriorizados.listLength + 1
      return getters.requerimientosFiltered("APRV").length + 1
    }
  },
  // reqsPendientesAprobacionLength: state =>
  //   state.reqsPendientesAprobacion.listLength,
  // reqsAprobadosPriorizadosLength: state =>
  //   state.reqsAprobadosPriorizados.listLength,
  esAutor: (state, getters, rootState, rootGetters) => {
    const userId = Number(rootGetters["auth/userId"])
    const reqUserId = Number(
      _.get(
        rootState,
        "requerimientos.detalleRequerimientoItem.usuario.id",
        null,
      ),
    )
    return userId === reqUserId
  },

  // Devuelve la lista de reqs filtrada. La lista filtrada depende del estado pasado por param
  requerimientosFiltered: (state, getters) => reqEstado => {
    let reqs

    switch (reqEstado) {
      case "PEND":
        reqs = [...getters.getPendientesAprobacion]
        break
      case "APRV":
        reqs = [...getters.getAprobadosPriorizados]
        break
    }
    const {
      descripcion = null,
      sistema = null,
      requerimientoTipo = null,
      // usuariosAsignados = null,
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
    // const isAssigOrInExec = reqEstado === "ASSI" || reqEstado === "EXEC"
    // if (isAssigOrInExec && usuariosAsignados && usuariosAsignados.length) {
    //   filtersToApply.push(filterByUsuariosAsignados(usuariosAsignados))
    // }
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

  getPendientesAprobacion: (state, getters, rootState, rootGetters) => {
    const estPendienteAprobacion = rootGetters[
      "requerimientos/getEstadoByCodigo"
    ]("PEND")
    const reqsResult = _.filter(state.requerimientos, {
      estado_priorizacion: { id: estPendienteAprobacion.id },
    })
    return _.orderBy(reqsResult, "[prioridad]", "asc")
  },

  getAprobadosPriorizados: (state, getters, rootState, rootGetters) => {
    const estAprobados = rootGetters["requerimientos/getEstadoByCodigo"]("APRV")
    const reqsResult = _.filter(state.requerimientos, {
      estado_priorizacion: { id: estAprobados.id },
    })
    return _.orderBy(reqsResult, "[prioridad]", "asc")
  },
}

const mutations = {
  SET_REQS_LIST: (state, listData) => {
    // state.requerimientos = [listData]
    // state.changesRequerimientos = [...listData]

    state.requerimientos = [...listData]
    state.changesRequerimientos = [...listData]
  },

  PUSH_REQS_LIST: (state, { listData }) => {
    state.requerimientos.push(...listData)
    state.changesRequerimientos.push(...listData)
  },
  SORT_REQUERIMIENTOS_BY_PRIORITY: state => {
    // Obtengo la lista
    state.requerimientos = _.sortBy(state.requerimientos, ["prioridad"])
  },
  SORT_CHANGE_REQUERIMIENTOS_BY_PRIORITY: () => {
    state.changesRequerimientos = _.sortBy(state.changesRequerimientos, [
      "prioridad",
    ])
  },
  // UPDATE_LIST_PRIORITY: (state, listType) => {
  //   // Obtengo la lista
  //   let list =
  //     listType === "pending"
  //       ? [...state.reqsPendientesAprobacion.list]
  //       : [...state.reqsAprobadosPriorizados.list]
  //   // Actualizo la prioridad por indice (orden)
  //   list = list.map((req, index) => {
  //     req.prioridad = index + 1
  //     return req
  //   })
  //   // Persisto los cambios localmente
  //   listType === "pending"
  //     ? (state.reqsPendientesAprobacion.list = list)
  //     : (state.reqsAprobadosPriorizados.list = list)
  // },
  // UPDATE_LIST_ESTADO: (state, listType) => {
  //   let list =
  //     listType === "pending"
  //       ? [...state.reqsPendientesAprobacion.list]
  //       : [...state.reqsAprobadosPriorizados.list]
  //   // Mapeo el valor del estado aca, porque si se produce un cambio de estado local
  //   // (de pendiente a aprobado y vicerversa) el nuevo listado va a tener el valor correcto en el campo estado
  //   list = list.map(req => {
  //     if (listType === "approved") {
  //       req.estado = { id: 2, descripcion: "Aprobado" }
  //     } else {
  //       req.estado = { id: 1, descripcion: "Pendiente aprobación" }
  //     }
  //     return req
  //   })
  //   // Persisto los cambios localmente
  //   listType === "pending"
  //     ? (state.reqsPendientesAprobacion.list = list)
  //     : (state.reqsAprobadosPriorizados.list = list)
  // },
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
  UPDATE_COMMENT_IN_REQ: (state, { reqId, comment }) => {
    _.find(state.changesRequerimientos, {
      id: reqId,
    }).comentario = comment
  },
  SET_USUARIO_IMPERSONATE: (state, usuarioImpersonateId) => {
    state.usuarioImpersonateId = usuarioImpersonateId
  },
  SET_FILTROS: (state, { filter, value }) => {
    state.filtros[filter] = value
  },
  CLEAR_FILTROS: state => {
    state.filtros.sistema = null
    state.filtros.requerimientoTipo = null
    state.filtros.descripcion = null
    // state.filtros.usuariosAsignados = []
  },
  UPDATE_REQUERIMIENTOS_ORDEN_APROBADOS: (
    state,
    {
      estadoAsignadoId,
      orderStart,
      reqIdToAvoid,
      updateOrderToCurrentRequerimiento = false,
    },
  ) => {
    // Actualiza todos los requerimientos aprobados priorizados
    state.changesRequerimientos = state.changesRequerimientos.map(ra => {
      if (ra.estado_priorizacion.id === estadoAsignadoId) {
        // Que tengan prioridad mayor o igual a orderStart y NO sea el reqerumiento priorizado
        const tieneOrdenMayorOIgual = ra.prioridad >= orderStart
        if (tieneOrdenMayorOIgual && ra.id !== reqIdToAvoid) {
          ra.prioridad += 1
        }
      }

      // Actualizo la prioridad del requerimiento en cuestion solo si es declarado explicitamente con updateOrderToCurrentRequerimiento=true (caso reordenamiento)
      if (updateOrderToCurrentRequerimiento && ra.id === reqIdToAvoid) {
        ra.prioridad = orderStart
      }
      return ra
    })

    state.changesRequerimientos = _.sortBy(state.changesRequerimientos, [
      "prioridad",
    ])

    // re indexa la prioridades de los aprobados
    let prioridad = 1
    state.changesRequerimientos = state.changesRequerimientos.map(rq => {
      if (rq.estado_priorizacion.id == estadoAsignadoId) {
        rq.prioridad = prioridad
        prioridad++
      }
      return rq
    })
  },
  UPDATE_ESTADO: (state, reqId) => {
    state.changesRequerimientos = state.changesRequerimientos.map(req => {
      if (req.id == reqId) {
        if (req.estado_priorizacion.id == 1) {
          req.estado_priorizacion = { id: 2, descripcion: "Aprobado" }
        } else {
          req.estado_priorizacion = {
            id: 1,
            descripcion: "Pendiente aprobación",
          }
        }
      }

      return req
    })
  },
}

const actions = {
  inicializarPriorizarRequerimientos(
    { commit, dispatch, rootGetters },
    { userId = null },
  ) {
    const esElUltimoDeLaCadenaDeMando =
      rootGetters["auth/esElUltimoDeLaCadenaDeMando"]

    const userIdToQuery = userId !== null ? userId : rootGetters["auth/userId"]

    // Si no impersonamos a nadie, el userId viene en null
    commit("SET_USUARIO_IMPERSONATE", userId)

    dispatch("getRequerimientosByUserAndEstado", {
      userId: userIdToQuery,
      reqState: "PEND",
    })

    if (!esElUltimoDeLaCadenaDeMando) {
      dispatch("getRequerimientosByUserAndEstado", {
        userId: userIdToQuery,
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
        commit("PUSH_REQS_LIST", { listData: data })
        commit("SORT_REQUERIMIENTOS_BY_PRIORITY")
        commit("SORT_CHANGE_REQUERIMIENTOS_BY_PRIORITY")
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

          // commit("UPDATE_LIST_PRIORITY", listType)

          // commit("UPDATE_LIST_ESTADO", listType)
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
            // commit("UPDATE_LIST_ESTADO", listType)
          }
        }
      } else {
        // actualizo localmente, aunque el cambio no es persistido
        commit("SET_REQS_LIST", {
          listType,
          listData: state.possibleChanges.sourceList,
        })
        // commit("UPDATE_LIST_ESTADO", listType)
      }
      commit("CLEAR_OPERATIONS")
      resolve()
    })
  },
  saveReorderApproved({ commit, state, getters, dispatch, rootGetters }) {
    return new Promise(async resolve => {
      // valido si efecivamente si hizo un cambio: Si el addedIndex y removedIndex son iguales, no se movio nada en la lista
      if (getters.differentPositionsTarget) {
        const backup = JSON.parse(JSON.stringify(state.changesRequerimientos))

        const estAprobados = rootGetters["requerimientos/getEstadoByCodigo"](
          "APRV",
        )

        const { orden } = getters.getNewOrder

        commit("UPDATE_REQUERIMIENTOS_ORDEN_APROBADOS", {
          estadoAsignadoId: estAprobados.id,
          orderStart: orden,
          reqIdToAvoid: getters.requerimientoIdToChange,
          updateOrderToCurrentRequerimiento: true,
        })

        let tempReqs = UpdatePendingPayloadPriorizarReq([
          ...state.changesRequerimientos,
        ])

        // Persisto los cambios en el remoto y si no gurado correctamente, reviertos los cambios
        const res = await dispatch("persistChanges", tempReqs)
        if (!res) {
          commit("SET_REQS_LIST", backup)
        } else {
          let newList = [...state.changesRequerimientos]
          commit("SET_REQS_LIST", newList)
        }
      }
      commit("CLEAR_OPERATIONS")
      resolve()
    })
  },
  async confirmOperation(
    { commit, getters, state, dispatch, rootGetters },
    comment,
  ) {
    return new Promise(async resolve => {
      const backup = JSON.parse(JSON.stringify(state.changesRequerimientos))
      // const backup = state.changesRequerimientos

      const reqId = getters.requerimientoIdToChange

      const estAprobados = rootGetters["requerimientos/getEstadoByCodigo"](
        "APRV",
      )
      const { orden } = getters.getNewOrder

      // Actualiza estado
      commit("UPDATE_ESTADO", reqId)

      // Actualiza el comentario
      commit("UPDATE_COMMENT_IN_REQ", {
        reqId,
        comment,
      })

      // Calcula prioridad
      commit("UPDATE_REQUERIMIENTOS_ORDEN_APROBADOS", {
        estadoAsignadoId: estAprobados.id,
        orderStart: orden,
        reqIdToAvoid: getters.requerimientoIdToChange,
        updateOrderToCurrentRequerimiento: true,
      })

      // generar payload
      let tempReqs = UpdatePendingPayloadPriorizarReq([
        ...state.changesRequerimientos,
      ])

      // // Persisto los cambios en el remoto y si no gurado correctamente, reviertos los cambios
      const res = await dispatch("persistChanges", tempReqs)

      if (!res) {
        commit("SET_REQS_LIST", backup)
      } else {
        let newList = [...state.changesRequerimientos]
        commit("SET_REQS_LIST", newList)
      }

      resolve()
    })
  },
  setDialogConfirmOperationOpen({ commit }, value = true) {
    commit("SET_DIALOG_CONFIRM_OPERATION_OPEN", value)
  },
  async persistChanges({ dispatch, getters, rootGetters, state }, list) {
    try {
      const userId = rootGetters["auth/userId"]
      dispatch("app/loadingInc", null, { root: true })
      await updateRequerimientosEstados(userId, {
        requerimientos: list,
        usuarioImpersonate: state.usuarioImpersonateId,
      })

      let message = ""
      switch (getters.operationType) {
        case "reorder-pending":
          message = "Requerimientos PRIORIZADOS"
          break
        case "reorder-approved":
          message = "Requerimientos aprobados PRIORIZADOS"
          break
        case "approve":
          message = `Requerimiento #${getters.requerimientoIdToChange} APROBADO`
          dispatch("app/getDashboardData", null, { root: true })
          break
        case "reject":
          message = `Requerimiento #${
            getters.requerimientoIdToChange
          } marcado como "PEND. DE APROBACIÓN"`
          dispatch("app/getDashboardData", null, { root: true })
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
  processManualChanges(
    { commit, state, dispatch, rootGetters, rootState, getters },
    { operation, priority, comment, listName },
  ) {
    return new Promise(async (resolve, reject) => {
      // Esta funcion arma manualmente los listados de requerimientos (como si hiciese un drag&drop) y emite los cambios
      const esElUltimoDeLaCadenaDeMando =
        rootGetters["auth/esElUltimoDeLaCadenaDeMando"]

      let updatedListData = {}
      let requerimientoItem = _.get(
        rootState,
        "requerimientos.detalleRequerimientoItem",
        null,
      )

      switch (operation) {
        case "aprobar": {
          // se debe llamar 2 veces a "PROCESS_UPDATE_LISTS", uno por cada lista
          const removedIndexSource = _.findIndex(
            // state.reqsPendientesAprobacion.list,
            getters.requerimientosFiltered("PEND"),
            { id: requerimientoItem.id },
          )
          const addedIndexSource = null
          // lista source, se saca el item del listado
          let listResultSource = [...getters.requerimientosFiltered("PEND")]
          const payload = listResultSource.splice(removedIndexSource, 1)[0]

          updatedListData = {
            listName: "source",
            listResult: listResultSource,
            dropResult: {
              removedIndex: removedIndexSource,
              addedIndex: addedIndexSource,
              payload,
            },
          }
          commit("PROCESS_UPDATE_LISTS", updatedListData)

          const removedIndexTarget = null
          const addedIndexTarget = priority - 1
          // lista target: se inserta el item en el listado

          let listResultTarget = [...getters.requerimientosFiltered("APRV")]
          listResultTarget.splice(addedIndexTarget, 0, payload)

          updatedListData = {
            listName: "target",
            listResult: listResultTarget,
            dropResult: {
              removedIndex: removedIndexTarget,
              addedIndex: addedIndexTarget,
              payload,
            },
          }
          commit("PROCESS_UPDATE_LISTS", updatedListData)
          await dispatch("confirmOperation", comment)
          commit("CLEAR_OPERATIONS")
          resolve()
          break
        }
        case "pendiente": {
          // se debe llamar 2 veces a "PROCESS_UPDATE_LISTS", uno por cada lista
          const removedIndexTarget = _.findIndex(
            // state.reqsAprobadosPriorizados.list,
            getters.requerimientosFiltered("APRV"),
            { id: requerimientoItem.id },
          )
          const addedIndexTarget = null
          // lista target, se saca el item del listado
          // let listResultTarget = [...state.reqsAprobadosPriorizados.list]
          let listResultTarget = [...getters.requerimientosFiltered("APRV")]
          const payload = listResultTarget.splice(removedIndexTarget, 1)[0]

          updatedListData = {
            listName: "target",
            listResult: listResultTarget,
            dropResult: {
              removedIndex: removedIndexTarget,
              addedIndex: addedIndexTarget,
              payload,
            },
          }
          commit("PROCESS_UPDATE_LISTS", updatedListData)

          const removedIndexSource = null
          const addedIndexSource = 0
          // lista source: se inserta el item en el listado
          // let listResultSource = [...state.reqsPendientesAprobacion.list]
          let listResultSource = [...getters.requerimientosFiltered("PEND")]
          listResultSource.splice(addedIndexSource, 0, payload)

          updatedListData = {
            listName: "source",
            listResult: listResultSource,
            dropResult: {
              removedIndex: removedIndexSource,
              addedIndex: addedIndexSource,
              payload,
            },
          }

          commit("PROCESS_UPDATE_LISTS", updatedListData)
          await dispatch("confirmOperation", comment)
          commit("CLEAR_OPERATIONS")
          resolve()
          break
        }
        case "seleccionarPrioridad": {
          // o podría preguntar por el getters.operationType
          if (listName === "source" && esElUltimoDeLaCadenaDeMando) {
            const removedIndexSource = _.findIndex(
              // state.reqsPendientesAprobacion.list,
              getters.requerimientosFiltered("PEND"),
              { id: requerimientoItem.id },
            )
            const addedIndexSource = priority - 1
            // lista source, se saca el item del listado y luego lo pongo en la nueva pos
            // let listResultSource = [...state.reqsPendientesAprobacion.list]
            let listResultSource = [getters.requerimientosFiltered("PEND")]
            const payload = listResultSource.splice(removedIndexSource, 1)[0]
            listResultSource.splice(addedIndexSource, 0, payload)

            updatedListData = {
              listName: "source",
              listResult: listResultSource,
              dropResult: {
                removedIndex: removedIndexSource,
                addedIndex: addedIndexSource,
                payload,
              },
            }
            commit("PROCESS_UPDATE_LISTS", updatedListData)
            await dispatch("saveReorderPending")
            commit("CLEAR_OPERATIONS")
            resolve()
          } else if (listName === "target" && !esElUltimoDeLaCadenaDeMando) {
            const removedIndexTarget = _.findIndex(
              getters.requerimientosFiltered("APRV"),
              { id: requerimientoItem.id },
            )
            const addedIndexTarget = priority - 1
            // lista source, se saca el item del listado y luego lo pongo en la nueva pos
            let listResultTarget = [...getters.requerimientosFiltered("APRV")]
            const payload = listResultTarget.splice(removedIndexTarget, 1)[0]
            listResultTarget.splice(addedIndexTarget, 0, payload)

            updatedListData = {
              listName: "target",
              listResult: listResultTarget,
              dropResult: {
                removedIndex: removedIndexTarget,
                addedIndex: addedIndexTarget,
                payload,
              },
            }
            commit("PROCESS_UPDATE_LISTS", updatedListData)
            await dispatch("saveReorderApproved")
            commit("CLEAR_OPERATIONS")
            resolve()
          }
          break
        }
        case "descartar": {
          const listType = listName === "source" ? "pending" : "approved"

          // Rechazo o elimino el requerimiento el requerimiento:
          try {
            let res
            if (getters.esAutor) {
              dispatch("app/loadingInc", null, { root: true })

              res = await deleteRequerimiento(requerimientoItem.id)
              // console.log(res)
            } else {
              dispatch("app/loadingInc", null, { root: true })
              res = await refuseRequerimiento(requerimientoItem.id, {
                comentario: comment,
              })
              // console.log(res)
            }

            // Lo elimino del listado correspondiente: busco el indice y lo quito y commiteo el cambio
            if (listName === "source") {
              const removedIndex = _.findIndex(
                // state.reqsPendientesAprobacion.list,
                // getters.requerimientosFiltered("PEND"),
                state.changesRequerimientos,
                { id: requerimientoItem.id },
              )
              let listResult = [...state.changesRequerimientos]
              listResult.splice(removedIndex, 1)

              commit("SET_REQS_LIST", listResult)
            } else if (listName === "target") {
              const removedIndex = _.findIndex(
                state.reqsAprobadosPriorizados.list,
                { id: requerimientoItem.id },
              )
              let listResult = [...state.reqsAprobadosPriorizados.list]
              listResult.splice(removedIndex, 1)

              commit("SET_REQS_LIST", { listType, listData: listResult })
            }

            commit("CLEAR_OPERATIONS")
            resolve(
              _.get(
                res,
                "data.message",
                "Operación completada satisfactoriamente",
              ),
            )
          } catch (e) {
            const message =
              e.message ||
              "Hubo un problema al cambiar el estado de este Requerimiento. Intente nuevamente más tarde"
            // warn({ message })
            reject(message)
          } finally {
            dispatch("app/loadingDec", null, { root: true })
          }

          break
        }
      }
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
  flushRequerimientos({ commit }) {
    commit("SET_REQS_LIST", [])
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
