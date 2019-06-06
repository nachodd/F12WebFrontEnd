import {
  createRequerimiento,
  storeRequerimiento,
  listRequerimientos,
  getRequerimiento,
  updateRequerimiento,
} from "@api/requerimientos"

const state = {
  // Create
  options: {
    // areas: [],
    sistemas: [],
    requerimientosTipos: [],
  },
  loadingOptions: true,
  loadingRequerimiento: true,

  estados: [
    { codigo: "PEND", descripcion: "Pendiente aprobación", id: "1" },
    { codigo: "APRV", descripcion: "Aprobado", id: "2" },
    { codigo: "EXEC", descripcion: "En ejecución", id: "3" },
    { codigo: "RESC", descripcion: "Resuelto cerrado", id: "4" },
    { codigo: "REJC", descripcion: "Rechazado", id: "5" },
  ],
  misRequerimientos: [],
}

// getters
const getters = {
  getEstadoByCodigo(state) {
    return codigo => _.find(state.estados, { codigo })
  },
}

const mutations = {
  SET_OPTIONS: (state, { sistemas, requerimientos_tipos }) => {
    // state.options.areas = Vue.set(state.options, "areas", areas)
    // state.options.areas = areas
    state.options.sistemas = sistemas
    state.options.requerimientosTipos = requerimientos_tipos
  },
  SET_LOADING_REQ: (state, newState) => {
    state.loadingRequerimiento = newState
  },
  TOGGLE_LOADING_OPTS: state => {
    state.loadingOptions = !state.loadingOptions
  },
  SET_LOADING_OPTS: (state, newState) => {
    state.loadingOptions = newState
  },

  SET_MIS_REQUERIMIENTOS: (state, newState) => {
    state.misRequerimientos = newState
  },
}

const actions = {
  createRequerimiento({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { sistemas, requerimientosTipos } = state.options
        commit("SET_LOADING_OPTS", true)
        commit("SET_LOADING_REQ", true)
        commit("app/LOADING_INC", null, { root: true })
        if (sistemas.length && requerimientosTipos.length) {
          resolve()
        } else {
          // destructuring value: https://medium.com/@pyrolistical/destructuring-nested-objects-9dabdd01a3b8
          const { data } = await createRequerimiento()
          commit("SET_OPTIONS", data)
          resolve()
        }
      } catch (error) {
        reject(error)
      } finally {
        commit("SET_LOADING_OPTS", false)
        commit("SET_LOADING_REQ", false)
        commit("app/LOADING_DEC", null, { root: true })
      }
    })
  },
  storeRequerimiento({ commit }, requerimiento) {
    return new Promise(async (resolve, reject) => {
      commit("SET_LOADING_REQ", true)
      commit("app/LOADING_INC", null, { root: true })
      try {
        // Si esta seteado el id, es porque esta editando
        if (requerimiento.id) {
          await updateRequerimiento(requerimiento, requerimiento.id)
        } else {
          await storeRequerimiento(requerimiento)
        }
        resolve()
      } catch (error) {
        reject(error)
      } finally {
        commit("SET_LOADING_REQ", false)
        commit("app/LOADING_DEC", null, { root: true })
      }
    })
  },
  listRequerimientos({ commit, rootState }, userId = null) {
    return new Promise(async (resolve, reject) => {
      commit("SET_LOADING_REQ", true)
      commit("app/LOADING_INC", null, { root: true })
      try {
        let userRequerimientos = userId
        const actualUserId = _.get(rootState, "auth.user.Id", null)
        if (!userRequerimientos && actualUserId) {
          userRequerimientos = actualUserId
        }
        const {
          data: { data },
        } = await listRequerimientos(userRequerimientos)
        console.log(data)
        commit("SET_MIS_REQUERIMIENTOS", data)

        resolve()
      } catch (error) {
        reject(error)
      } finally {
        commit("SET_LOADING_REQ", false)
        commit("app/LOADING_DEC", null, { root: true })
      }
    })
  },
  getRequerimiento({ commit }, requerimientoId = null) {
    return new Promise(async (resolve, reject) => {
      commit("SET_LOADING_REQ", true)
      commit("app/LOADING_INC", null, { root: true })
      try {
        const {
          data: { data },
        } = await getRequerimiento(requerimientoId)
        commit("SET_REQUERIMIENTO_DETALLE", data)

        resolve()
      } catch (error) {
        reject(error)
      } finally {
        commit("SET_LOADING_REQ", false)
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
