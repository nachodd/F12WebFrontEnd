import {
  getRequerimientosForPanelAsignacion,
  asignarRequerimiento,
  desasignarRequerimiento,
  refuseRequerimiento,
  pasarAProcesosRequerimiento,
  enviarAPriorizarRequerimiento,
} from "@api/requerimientos"
import Requerimiento from "@models/Requerimiento"
import {
  filterByAsuntoAndDescripcion,
  filterBySistema,
  filterByTipoRequerimiento,
} from "@utils/requerimientos"

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
    return _.orderBy(reqsResult, "[estado.asignacion.orden]", "asc")
  },
  requerimientosEnEjecucion: (state, getters, rootState, rootGetters) => {
    const estadoEnEjec = rootGetters["requerimientos/getEstadoByCodigo"]("EXEC")
    const reqsResult = _.filter(state.requerimientos, {
      estado: { id: estadoEnEjec.id },
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
    }
    let descripcion = state.filtros.descripcion || null
    let sistema = state.filtros.sistema || null
    let requerimientoTipo = state.filtros.requerimientoTipo || null
    if (descripcion !== null) {
      reqs = filterByAsuntoAndDescripcion(reqs, descripcion)
    }
    if (sistema && sistema.id) {
      reqs = filterBySistema(reqs, sistema.id)
    }
    if (requerimientoTipo && requerimientoTipo.id) {
      reqs = filterByTipoRequerimiento(reqs, requerimientoTipo.id)
    }
    return reqs
  },
  requerimientosAsignadosFiltered: (state, getters) => {
    let reqs = [...getters.requerimientosAsignados]

    let descripcion = state.filtros.descripcion || null
    let sistema = state.filtros.sistema || null
    let requerimientoTipo = state.filtros.requerimientoTipo || null
    if (descripcion !== null) {
      reqs = filterByAsuntoAndDescripcion(reqs, descripcion)
    }
    if (sistema && sistema.id) {
      reqs = filterBySistema(reqs, sistema.id)
    }
    if (requerimientoTipo && requerimientoTipo.id) {
      reqs = filterByTipoRequerimiento(reqs, requerimientoTipo.id)
    }
    return reqs
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
  newPosition: (state, getters) => {
    const index = _.findIndex(state.possibleChanges.targetList, {
      id: getters.requerimientoIdToChange,
    })

    const nextReq = state.possibleChanges.targetList[index + 1]
    if (nextReq) {
      return nextReq.estado.asignacion.orden
    } else {
      // lo puso al final de la lista
      return null // getters.requerimientosAsignados.length
    }
  },
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
  UPDATE_REQUERIMIENTOS_ORDEN_ASIGNADO: (
    state,
    { estadoAsignadoId, orderStart, reqIdToAvoid, usuarioAsignado },
  ) => {
    state.requerimientos = state.requerimientos.map(ra => {
      if (ra.estado.id === estadoAsignadoId) {
        if (
          ra.estado.asignacion.orden >= orderStart &&
          ra.id !== reqIdToAvoid
        ) {
          ra.estado.asignacion.orden += 1
        }
        if (ra.id === reqIdToAvoid) {
          ra.estado.asignacion = {
            usuario_id: usuarioAsignado.id,
            usuario_nombre: usuarioAsignado.nombre,
            orden: orderStart,
          }
        }
      }
      return ra
    })
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
    { commit, rootGetters, getters, state },
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
            let orden = getters.newPosition
            // será ultimo si en la targetList está el solo u orden es null
            const ultimo =
              state.possibleChanges.targetList.length === 1 || orden === null

            const dataAsignar = {
              usuario: userId,
              usuario_asignado: data.usuarioAsignado.value,
              fecha_finalizacion_estimada: data.fechaFinalizacion,
              horas_estimadas: data.horasEstimadas,
              comentario,
              orden,
              ultimo,
            }
            console.log(dataAsignar)
            console.log(asignarRequerimiento)
            //const res = await asignarRequerimiento(requerimientoId, dataAsignar)
            //message = _.get(res, "data.message", null)

            // si el orden es null, antes de que se cambie de columna el recien asignado, determinar el orden
            if (orden === null) {
              if (getters.requerimientosAsignados.length === 0) {
                debugger // testear este caso
                orden = 1
              } else {
                const lastReq =
                  getters.requerimientosAsignados[
                    getters.requerimientosAsignados.length - 1
                  ]
                orden = lastReq.estado.asignacion.orden + 1
              }
            }

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
            // Updateo el estado
            commit("SET_ESTADO_REQUERIMIENTO", { requerimientoId, newState })
            const usuarioAsignado = {
              id: data.usuarioAsignado.value,
              nombre: data.usuarioAsignado.label,
            }

            // Updatea el Orden (o seatea) y el objeto "estado.asignacion"
            commit("UPDATE_REQUERIMIENTOS_ORDEN_ASIGNADO", {
              estadoAsignadoId: estadoAsignado.id,
              orderStart: orden,
              reqIdToAvoid: requerimientoId,
              usuarioAsignado,
            })

            // TODO: pegarle al endpoint y que funcione
            // TODO: hacer el reodenamiento de asignados
            // TODO: ver si no hay que modificar desaignar (borrar el objeto asignacion y el orden)
            // TODO: agregar al filtro, la posibilidad que filtre por nombre de asignado y/o el usuario que lo crea

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
          case "descartar":
          case "aPriorizar": {
            let res
            if (operation === "descartar") {
              res = await refuseRequerimiento(requerimientoId, {
                comentario,
              })
            } else if (operation === "aProcesos") {
              res = await pasarAProcesosRequerimiento(requerimientoId, {
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
        resolve(message)
      } catch (error) {
        reject(error)
      } finally {
        commit("app/LOADING_DEC", null, { root: true })
      }
    })
  },

  processUpdateList(
    { commit, getters, dispatch, state, rootGetters },
    updatedListData,
  ) {
    // console.log(getters.operationType)
    return new Promise(async (resolve, reject) => {
      // updatea los listados temporales
      commit("PROCESS_UPDATE_LISTS", updatedListData)

      if (!getters.possibleChangesSetted) {
        return
      }

      // Valido si el requerimiento fue enviado a procesos
      const stateSentToProcess = rootGetters[
        "requerimientos/getEstadoByCodigo"
      ]("STPR")
      const reqToChange = state.possibleChanges.payload
      if (reqToChange.estado.id === stateSentToProcess.id) {
        dispatch("clearOperations")
        reject({
          message:
            "El requermiento no se puede asignar, el mismo se encuentra EN PROCESOS",
        })
        return
      }

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
          break
        case "reorder-assigned": {
          console.log("targetList ", state.possibleChanges.targetList)
          console.log("targetChanges ", state.possibleChanges.targetChanges)
          console.log("payload ", state.possibleChanges.payload)

          dispatch("clearOperations")
          break
        }
        default:
          dispatch("clearOperations")
          break
      }
      resolve()
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
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
