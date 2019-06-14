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
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
