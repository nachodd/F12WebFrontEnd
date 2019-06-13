import {
  getRequerimientosForAsignar,
  // getRequerimientosAsignados,
  asignarRequerimientos,
} from "@api/requerimientos"
import Requerimiento from "@models/Requerimiento"

const state = {
  requerimientos: [],
  loadingRequerimientos: false,
}
const getters = {
  requerimientosSinAsignar: (state, getters, rootState, rootGetters) => {
    const estSinAsig = rootGetters["requerimientos/getEstadoByCodigo"]("NOAS")
    const reqsSinAsig = _.filter(state.requerimientos, {
      estado: { id: estSinAsig.id },
    })
    return _.orderBy(reqsSinAsig, "tipo.id", "asc")
  },
  requerimientosAsignados: (state, getters, rootState, rootGetters) => {
    const estAsignado = rootGetters["requerimientos/getEstadoByCodigo"]("ASSI")
    return _.filter(state.requerimientos, {
      estado: { id: estAsignado.id },
    })
  },
  requerimientosPendientes: (state, getters, rootState, rootGetters) => {
    const estadoEnEjec = rootGetters["requerimientos/getEstadoByCodigo"]("EXEC")
    return _.filter(state.requerimientos, {
      estado: { id: estadoEnEjec.id },
    })
  },
}

const mutations = {
  SET_REQUERIMIENTOS: (state, requerimientos) => {
    state.requerimientos = _.map(requerimientos, req => new Requerimiento(req))
  },
  SET_LOADING_REQUERIMIENTOS: (state, loadingRequerimientos) => {
    state.loadingRequerimientos = loadingRequerimientos
  },
  ASIGNAR_REQUERIMIENTO: (state, { requerimientoId, newState }) => {
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
        const requerimientos = await getRequerimientosForAsignar(
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
    { commit, rootGetters },
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
            const res = await asignarRequerimientos(
              requerimientoId,
              dataAsignar,
            )
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
            commit("ASIGNAR_REQUERIMIENTO", { requerimientoId, newState })
            break
          }
          case "descartar": {
            // TODO: Implementar!
            break
          }
          case "desasignar": {
            // TODO: Implementar!
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
