import {
  getRequerimientosForPanelAsignacion,
  asignarRequerimiento,
  desasignarRequerimiento,
  refuseRequerimiento,
  pasarAProcesosRequerimiento,
} from "@api/requerimientos"
import Requerimiento from "@models/Requerimiento"

const state = {
  requerimientos: [],
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
    payload: {},
  },
}
const getters = {
  requerimientosSinAsignar: (state, getters, rootState, rootGetters) => {
    const estSinAsig = rootGetters["requerimientos/getEstadoByCodigo"]("NOAS")
    const estEnProceso = rootGetters["requerimientos/getEstadoByCodigo"]("STPR")
    let reqsResult = _.filter(state.requerimientos, req => {
      return _.includes([estSinAsig.id, estEnProceso.id], req.estado.id)
    })
    return _.orderBy(reqsResult, "tipo.id", "asc")
  },
  requerimientosAsignados: (state, getters, rootState, rootGetters) => {
    const estAsignado = rootGetters["requerimientos/getEstadoByCodigo"]("ASSI")
    const reqsResult = _.filter(state.requerimientos, {
      estado: { id: estAsignado.id },
    })
    return _.orderBy(reqsResult, "tipo.id", "asc")
  },
  requerimientosPendientes: (state, getters, rootState, rootGetters) => {
    const estadoEnEjec = rootGetters["requerimientos/getEstadoByCodigo"]("EXEC")
    const reqsResult = _.filter(state.requerimientos, {
      estado: { id: estadoEnEjec.id },
    })
    return _.orderBy(reqsResult, "tipo.id", "asc")
  },
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
    if (getters.operationApprove && !getters.operationReject) {
      return "approve"
    } else if (!getters.operationApprove && getters.operationReject) {
      return "reject"
    } else {
      return ""
    }
  },
  requerimientoIdToChange: state =>
    _.get(state.possibleChanges.payload, "id", ""),
}

const mutations = {
  SET_REQUERIMIENTOS: (state, requerimientos) => {
    state.requerimientos = _.map(requerimientos, req => new Requerimiento(req))
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

  PROCESS_UPDATE_LISTS: (state, { listName, dropResult }) => {
    const { removedIndex, addedIndex, payload } = dropResult
    // state.possibleChanges[`${listName}List`] = listResult
    state.possibleChanges[`${listName}Changes`] = {
      addedIndex,
      removedIndex,
      changesSetted: true, // seteo que hubo cambios en este listado
    }
    state.possibleChanges.payload = payload
  },
  CLEAR_OPERATIONS: state => {
    for (const listName of ["source", "target"]) {
      // state.possibleChanges[`${listName}List`] = []
      state.possibleChanges[`${listName}Changes`] = {
        addedIndex: null,
        removedIndex: null,
        changesSetted: false,
      }
    }
    state.possibleChanges.payload = {}
    state.dialogConfirmOpen = false
  },
}

const actions = {
  fetchRequerimientos({ commit, rootGetters }, userId = null) {
    return new Promise(async (resolve, reject) => {
      try {
        commit("app/LOADING_INC", null, { root: true })
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
        commit("app/LOADING_DEC", null, { root: true })
        commit("SET_LOADING_REQUERIMIENTOS", false)
      }
    })
  },
  updateRequerimientoState(
    { commit, rootGetters, state },
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
            const dataAsignar = {
              usuario: userId,
              usuario_asignado: data.usuarioAsignado.value,
              fecha_finalizacion_estimada: data.fechaFinalizacion,
              horas_estimadas: data.horasEstimadas,
              comentario,
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
              },
            }
            commit("SET_ESTADO_REQUERIMIENTO", { requerimientoId, newState })
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
          case "aProcesos":
          case "descartar": {
            let res
            if (operation === "descartar") {
              res = await refuseRequerimiento(requerimientoId, {
                comentario,
              })
            } else if (operation === "aProcesos") {
              res = await pasarAProcesosRequerimiento(requerimientoId, {
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
        resolve(message)
      } catch (error) {
        reject(error)
      } finally {
        commit("app/LOADING_DEC", null, { root: true })
      }
    })
  },

  processUpdateList({ commit, getters, dispatch }, updatedListData) {
    // console.log(getters.operationType)
    return new Promise(async resolve => {
      // updatea los listados temporales
      commit("PROCESS_UPDATE_LISTS", updatedListData)

      if (!getters.possibleChangesSetted) {
        return
      }

      switch (getters.operationType) {
        case "approve":
        case "reject":
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
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
