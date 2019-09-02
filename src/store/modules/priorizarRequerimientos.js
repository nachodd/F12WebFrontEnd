// import RequerimientosPriorizarList from "models/requerimientosPriorizarList"
// import Requerimiento from "models/requerimiento"

import {
  // getRequerimientosByUserAndEstado,
  getRequerimientosForPanelPriorizacion,
  updateRequerimientosEstados,
  refuseRequerimiento,
  deleteRequerimiento,
  pasarAProcesosRequerimiento,
  // getRequerimiento,
} from "api/requerimientos"
import {
  filterByAsuntoAndDescripcion,
  filterBySistema,
  filterByTipoRequerimiento,
  // filterByUsuariosAsignados,
  filterByUsuarioAltaId,
  UpdatePendingPayloadPriorizarReq,
} from "utils/requerimientos"
import { warn, success, pipeWith } from "utils/helpers"
import Requerimiento from "models/requerimiento"
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
    usuarioAlta: null,
    // usuariosAsignados: [],
  },
}

const getters = {
  requerimientoIdToChange: state => _.get(state.possibleChanges.payload, "id", ""),
  // Los cambios estaran seteados si: fueron seteados los 2 listados y el payload
  // o si fue seteado el target Y es el ultimo de la cadena de mando (si es así, solo tiene ese listado)
  possibleChangesSetted: (state, getters, rootState, rootGetters) => {
    const esElUltimoDeLaCadenaDeMando = rootGetters["auth/esElUltimoDeLaCadenaDeMando"]
    return (
      (state.possibleChanges.sourceChanges.changesSetted &&
        state.possibleChanges.targetChanges.changesSetted &&
        state.possibleChanges.payload.id &&
        !esElUltimoDeLaCadenaDeMando) ||
      (state.possibleChanges.targetChanges.changesSetted &&
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
    const esElUltimoDeLaCadenaDeMando = rootGetters["auth/esElUltimoDeLaCadenaDeMando"]

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
    const reqUserId = Number(_.get(rootState, "requerimientos.detallereq.usuario.id", null))
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
      usuarioAlta = null,
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
    if (usuarioAlta && usuarioAlta.id) {
      filtersToApply.push(filterByUsuarioAltaId(usuarioAlta.id))
    }
    // const isAssigOrInExec = reqEstado === "ASSI" || reqEstado === "EXEC"
    // if (isAssigOrInExec && usuariosAsignados && usuariosAsignados.length) {
    //   filtersToApply.push(filterByUsuariosAsignados(usuariosAsignados))
    // }
    // aplica a reqs el conjunto de filtros
    return pipeWith(reqs, ...filtersToApply)
  },

  getNewOrder: (state, getters, rootState, rootGetters) => {
    // Busca el requerimiento a actualizar en el listado que está en pantalla
    const reqsAprobadosPriorizadosOnScreen = state.possibleChanges.targetList
    const index = _.findIndex(reqsAprobadosPriorizadosOnScreen, {
      id: getters.requerimientoIdToChange,
    })
    // De estos, busco el siguiente en pantalla
    const nextReq = reqsAprobadosPriorizadosOnScreen[index + 1]

    if (nextReq) {
      // Si lo encuentra, devuelve su orden e indico que NO es el ultimo
      return {
        orden: nextReq.prioridad,
        ultimo: false,
      }
    } else {
      // Si es el ultimo de la cadena, la lista será la pendientes de aprob. Caso contrario, la de aprobados
      const listToUse = rootGetters["auth/esElUltimoDeLaCadenaDeMando"]
        ? getters.getPendientesAprobacion
        : getters.getAprobadosPriorizados

      // Caso contario, determino el orden REAL
      let orden
      // Si no hay otros reqs asignados, orden = 1
      if (listToUse.length === 0) {
        orden = 1
      } else {
        // Busco el último reqs de los asignados, tomo su orden y le aumento 1
        const lastReq = listToUse[listToUse.length - 1]
        orden = lastReq.prioridad + 1
      }
      // Será el ultimo (ya sea porque se filtro el listado y no hay nada o porque efectivametne no habia otro asignado)
      return {
        orden,
        ultimo: true,
      }
    }
  },

  getPendientesAprobacion: state => {
    const estPendienteAprobacionId = Requerimiento.getEstadoId("PEND")
    const reqsResult = _.filter(state.requerimientos, {
      estado_priorizacion: { id: estPendienteAprobacionId },
    })
    return _.orderBy(reqsResult, ["prioridad"], "asc")
  },

  getAprobadosPriorizados: state => {
    const estAprobadosId = Requerimiento.getEstadoId("APRV")
    const reqsResult = _.filter(state.requerimientos, {
      estado_priorizacion: { id: estAprobadosId },
    })
    return _.orderBy(reqsResult, ["prioridad"], "asc")
  },
}

const mutations = {
  SET_REQS_LIST: (state, listData) => {
    // state.requerimientos = [listData]
    // state.changesRequerimientos = [...listData]

    state.requerimientos = [...listData]
    state.changesRequerimientos = [...listData]

    // state.requerimientos = _.sortBy(state.requerimientos, ["prioridad"])
    // state.changesRequerimientos = _.sortBy(state.changesRequerimientos, [
    //   "prioridad",
    // ])
  },

  PUSH_REQS_LIST: (state, { listData }) => {
    // state.requerimientos.push(...listData)
    // state.changesRequerimientos.push(...listData)
    state.requerimientos.push(..._.map(listData, req => new Requerimiento(req)))
    state.changesRequerimientos.push(..._.map(listData, req => new Requerimiento(req)))

    //  state.requerimientos = _.sortBy(state.requerimientos, ["prioridad"])
    //  state.changesRequerimientos = _.sortBy(state.changesRequerimientos, [
    //    "prioridad",
    //  ])
  },
  SET_LOADING_STATE_REQS_LISTS: (state, { loadingState }) => {
    state.loadingReqsPendientesAprobacion = loadingState
    state.loadingReqsAprobadosPriorizados = loadingState
    // listType === "pending"
    //   ? (state.loadingReqsPendientesAprobacion = loadingState)
    //   : (state.loadingReqsAprobadosPriorizados = loadingState)
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
  SET_FILTRO: (state, { filter, value }) => {
    state.filtros[filter] = value
  },
  SET_FILTROS: (state, filters) => {
    state.filtros["descripcion"] = filters.descripcion
    state.filtros["sistema"] = filters.sistema
    state.filtros["requerimientoTipo"] = filters.tipo
    state.filtros["usuarioAlta"] = filters.usuarioAlta
  },
  CLEAR_FILTROS: state => {
    state.filtros.sistema = null
    state.filtros.requerimientoTipo = null
    state.filtros.descripcion = null
  },
  UPDATE_REQUERIMIENTOS_ORDEN_APROBADOS: (
    state,
    { estadoTargetId, orderStart, reqIdToAvoid, updateOrderToCurrentRequerimiento = false },
  ) => {
    // Actualiza todos los requerimientos aprobados priorizados
    state.changesRequerimientos = state.changesRequerimientos.map(ra => {
      if (ra.estado_priorizacion.id === estadoTargetId) {
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

    state.changesRequerimientos = _.sortBy(state.changesRequerimientos, ["prioridad"])

    // re indexa la prioridades de los aprobados
    let prioridad = 1
    state.changesRequerimientos = state.changesRequerimientos.map(rq => {
      if (rq.estado_priorizacion.id == estadoTargetId) {
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

        const removedIndexChangeReqs = _.findIndex(state.changesRequerimientos, {
          id: req.id,
        })
        if (removedIndexChangeReqs !== -1) {
          state.changesRequerimientos.splice(removedIndexChangeReqs, 1, new Requerimiento(req))
        } else {
          state.changesRequerimientos.push(new Requerimiento(req))
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

        const removedIndexChangeReqs = _.findIndex(state.changesRequerimientos, {
          id: req.id,
        })
        if (removedIndexChangeReqs !== -1) {
          state.changesRequerimientos.splice(removedIndexChangeReqs, 1, new Requerimiento(req))
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

        const removedIndexChangeReqs = _.findIndex(state.changesRequerimientos, {
          id: req.id,
        })
        if (removedIndexChangeReqs !== -1) {
          state.changesRequerimientos.splice(removedIndexChangeReqs, 1)
        }
        break
      }
    }
  },
}

const actions = {
  async inicializarPriorizarRequerimientos({ commit, dispatch, rootGetters }, { userId = null }) {
    // const esElUltimoDeLaCadenaDeMando = rootGetters["auth/esElUltimoDeLaCadenaDeMando"]

    // Si no impersonamos a nadie, el userId viene en null

    const userIdToQuery = userId !== null ? userId : rootGetters["auth/userId"]
    commit("SET_USUARIO_IMPERSONATE", userId)
    commit("SET_REQS_LIST", [])

    // Traigo los usuarios para el filtro de usuarios de alta
    dispatch("app/loadingInc", null, { root: true })
    await dispatch("auth/getUsuariosFiltro", null, { root: true })

    commit("SET_LOADING_STATE_REQS_LISTS", { loadingState: true })
    return getRequerimientosForPanelPriorizacion(userIdToQuery)
      .then(listData => {
        commit("PUSH_REQS_LIST", { listData })
      })
      .catch(e => console.log(e))
      .finally(() => {
        commit("SET_LOADING_STATE_REQS_LISTS", { loadingState: false })
        dispatch("app/loadingDec", null, { root: true })
      })
  },
  /* getRequerimientosByUserAndEstado({ commit, rootGetters }, { userId, reqState }) {
    const estadoReq = rootGetters["requerimientos/getEstadoByCodigo"](reqState)
    const listType = reqState === "PEND" ? "pending" : "approved"
    commit("SET_LOADING_STATE_REQS_LISTS", { listType, loadingState: true })

    return getRequerimientosByUserAndEstado(userId, estadoReq.id)
      .then(({ data: { data } }) => {
        commit("PUSH_REQS_LIST", { listData: data })
      })
      .catch(e => console.log(e))
      .finally(() => {
        commit("SET_LOADING_STATE_REQS_LISTS", {
          listType,
          loadingState: false,
        })
      })
  }, */
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
        // case "reorder-pending":
        //   dispatch("saveReorderPending")
        //   break
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
  saveReorderApproved({ commit, state, getters, dispatch, rootGetters }) {
    return new Promise(async resolve => {
      // valido si efecivamente si hizo un cambio: Si el addedIndex y removedIndex son iguales, no se movio nada en la lista
      if (getters.differentPositionsTarget) {
        const backup = JSON.parse(JSON.stringify(state.changesRequerimientos))

        const esElUltimoDeLaCadenaDeMando = rootGetters["auth/esElUltimoDeLaCadenaDeMando"]

        const estadoTargetId = esElUltimoDeLaCadenaDeMando
          ? Requerimiento.getEstadoId("PEND")
          : Requerimiento.getEstadoId("APRV")

        const { orden } = getters.getNewOrder

        commit("UPDATE_REQUERIMIENTOS_ORDEN_APROBADOS", {
          estadoTargetId: estadoTargetId,
          orderStart: orden,
          reqIdToAvoid: getters.requerimientoIdToChange,
          updateOrderToCurrentRequerimiento: true,
        })

        let tempReqs = UpdatePendingPayloadPriorizarReq([...state.changesRequerimientos])

        // Persisto los cambios en el remoto y si no gurado correctamente, reviertos los cambios
        const res = await dispatch("persistChanges", tempReqs)
        if (!res) {
          commit("SET_REQS_LIST", backup)
        } else {
          commit("SET_REQS_LIST", [...state.changesRequerimientos])
        }
      }
      commit("CLEAR_OPERATIONS")
      resolve()
    })
  },
  async confirmOperation({ commit, getters, state, dispatch }, comment) {
    return new Promise(async resolve => {
      const backup = JSON.parse(JSON.stringify(state.changesRequerimientos))
      const reqId = getters.requerimientoIdToChange
      const estAprobadosId = Requerimiento.getEstadoId("APRV")
      const { orden } = getters.getNewOrder

      // Actualiza estado y Actualiza el comentario
      commit("UPDATE_ESTADO", reqId)
      commit("UPDATE_COMMENT_IN_REQ", {
        reqId,
        comment,
      })
      // Calcula prioridad
      commit("UPDATE_REQUERIMIENTOS_ORDEN_APROBADOS", {
        estadoTargetId: estAprobadosId,
        orderStart: orden,
        reqIdToAvoid: getters.requerimientoIdToChange,
        updateOrderToCurrentRequerimiento: true,
      })

      // generar payload
      let tempReqs = UpdatePendingPayloadPriorizarReq([...state.changesRequerimientos])

      // Persisto los cambios en el remoto y si no gurado correctamente, reviertos los cambios
      const res = await dispatch("persistChanges", tempReqs)

      if (!res) {
        commit("SET_REQS_LIST", backup)
      } else {
        commit("SET_REQS_LIST", [...state.changesRequerimientos])
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
          // dispatch("app/getDashboardData", null, { root: true })
          break
        case "reject":
          message = `Requerimiento #${
            getters.requerimientoIdToChange
          } marcado como "PEND. DE APROBACIÓN"`
          // dispatch("app/getDashboardData", null, { root: true })
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
    { operation, priority, comment },
  ) {
    return new Promise(async (resolve, reject) => {
      // Esta funcion arma manualmente los listados de requerimientos (como si hiciese un drag&drop) y emite los cambios
      const esElUltimoDeLaCadenaDeMando = rootGetters["auth/esElUltimoDeLaCadenaDeMando"]

      let updatedListData = {}
      let req = _.get(rootState, "requerimientos.detalleRequerimientoItem", null)

      switch (operation) {
        case "aprobar": {
          // se debe llamar 2 veces a "PROCESS_UPDATE_LISTS", uno por cada lista
          const removedIndexSource = _.findIndex(
            // state.reqsPendientesAprobacion.list,
            getters.requerimientosFiltered("PEND"),
            { id: req.id },
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
            { id: req.id },
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
          // dependiendo del si es el ultimo de la cadena, tengo que buscar los reqs en el listado general del estado aporpiado
          const reqState = esElUltimoDeLaCadenaDeMando ? "PEND" : "APRV"
          // "Genero" los listados de possibleChanges como si hubiese arrastrado
          const removedIndex = _.findIndex(getters.requerimientosFiltered(reqState), { id: req.id })
          const addedIndex = priority - 1
          // JSON.parse(JSON.stringify(getters.requerimientosFiltered(reqState)))
          let listResult = [...getters.requerimientosFiltered(reqState)]
          const payload = listResult.splice(removedIndex, 1)[0]
          listResult.splice(addedIndex, 0, payload)
          updatedListData = {
            listName: "target",
            listResult: listResult,
            dropResult: {
              removedIndex: removedIndex,
              addedIndex: addedIndex,
              payload,
            },
          }
          commit("PROCESS_UPDATE_LISTS", updatedListData)
          // mando a guardar los cambios como si hubiese arrastrado
          await dispatch("saveReorderApproved")
          commit("CLEAR_OPERATIONS")
          resolve()
          break
        }
        case "descartar":
        case "aProcesos": {
          // const listType = listName === "source" ? "pending" : "approved"

          // Rechazo o elimino el requerimiento el requerimiento:
          try {
            let res
            dispatch("app/loadingInc", null, { root: true })

            if (operation === "descartar") {
              if (getters.esAutor) {
                res = await deleteRequerimiento(req.id)
              } else {
                res = await refuseRequerimiento(req.id, {
                  comentario: comment,
                })
              }
            } else if (operation === "aProcesos") {
              // Chequeamos, debe tener estado de priorizacion "APROBADO", porque asi a procesos le llega con prioridad
              if (req.tieneEstadoPriorizacion("PEND")) {
                reject(
                  "El requerimiento debe estar Aprobado y Priorizado por usted antes de enviarlo a Procesos",
                )
                return
              }

              res = await pasarAProcesosRequerimiento(req.id, {
                comentario: comment,
              })
            }

            // Lo elimino del listado: busco el indice y lo quito y commiteo el cambio
            const removedIndex = _.findIndex(state.changesRequerimientos, {
              id: req.id,
            })
            if (removedIndex !== -1) {
              let listResult = [...state.changesRequerimientos]
              listResult.splice(removedIndex, 1)
              commit("SET_REQS_LIST", listResult)
            }

            commit("CLEAR_OPERATIONS")
            resolve(_.get(res, "data.message", "Operación completada satisfactoriamente"))
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
