import RequerimientosAsignadosList from "src/models/RequerimientosAsignadosList"
import {
  getRequerimientosAsignadosByUser,
  ejecutarRequerimiento,
  cancelaEjecucionRequerimiento,
  finalizarRequerimiento,
} from "@api/requerimientos"

// import { warn, success } from "@utils/helpers"

const state = {
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
}

const getters = {
  // Los cambios estaran seteados si: fueron seteados los 2 listados y el payload
  // o si fue seteado el source Y es el ultimo de la cadena de mando (si es así, solo tiene ese listado)
  possibleChangesSetted: state => {
    return (
      (state.possibleChanges.sourceChanges.changesSetted &&
        state.possibleChanges.targetChanges.changesSetted &&
        Boolean(state.possibleChanges.payload.id)) ||
      (state.possibleChanges.sourceChanges.changesSetted &&
        Boolean(state.possibleChanges.payload.id))
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

  requerimientoIdToChange: state =>
    _.get(state.possibleChanges.payload, "id", ""),
}

const mutations = {
  SET_REQS_LIST: (state, { listName, listData }) => {
    state[`${listName}`].list = listData
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
}

const actions = {
  inicializarRequerimientosAsignados({ dispatch, rootGetters }) {
    const currentUserId = rootGetters["auth/userId"]

    dispatch("getRequerimientosAsignadosByUser", {
      userId: currentUserId,
    })
  },

  getRequerimientosAsignadosByUser({ commit, rootGetters }, { userId }) {
    // const listType = reqState === "PEND" ? "pending" : "approved"

    // commit("SET_LOADING_STATE_REQS_LISTS", { listType, loadingState: true })

    let codReqPendiente = rootGetters["requerimientos/getEstadoByCodigo"](
      "ASSI",
    ).id
    let codReqEjecucion = rootGetters["requerimientos/getEstadoByCodigo"](
      "EXEC",
    ).id

    return getRequerimientosAsignadosByUser(
      userId,
      codReqPendiente,
      codReqEjecucion,
    )
      .then(({ data: { data } }) => {
        if (data.length > 0) {
          let listadoPendientes = _.filter(data, {
            estado: { id: codReqPendiente },
          })

          commit("SET_REQS_LIST", {
            listName: "reqsAsignadosPendientes",
            listData: listadoPendientes,
          })

          let listadoEnEjecucion = _.filter(data, {
            estado: { id: codReqEjecucion },
          })

          commit("SET_REQS_LIST", {
            listName: "reqsAsignadosEnEjecucion",
            listData: listadoEnEjecucion,
          })
        }

        // commit("UPDATE_LIST_ESTADO", listType)
        // commit("SORT_LIST_BY_PRIORITY", listType)
      })
      .catch(e => console.log(e))
      .finally(() => {
        // commit("SET_LOADING_STATE_REQS_LISTS", {
        //   listType,
        //   loadingState: false,
        // })
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
    { operation, priority, comment, listName, horasEstimadas },
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

            const reqId = requerimientoItem.id

            await ejecutarRequerimiento(reqId)

            /**
             * pendientes
             */
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

            /**
             *  Ejecucion
             *
             */
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
            const reqId = requerimientoItem.id
            await cancelaEjecucionRequerimiento(reqId, { comment })

            /****************************
            CAMBIOS EN EL Target
            -------------------------
            Se saca el item del listado
            *****************************/
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

            /*********************************
            CAMBIOS EN EL SOURCE
            -----------------------------
            se inserta el item en el listado
            **********************************/
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
