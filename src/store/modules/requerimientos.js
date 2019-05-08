import {
  createRequerimiento,
  storeRequerimiento,
  listRequerimientos,
  getRequerimiento,
} from "@api/requerimientos"

const state = {
  // Create
  options: {
    areas: [],
    sistemas: [],
    requerimientosTipos: [],
  },
  loadingOptions: true,
  loadingRequerimiento: true,

  // List
  misRequerimientos: [],
  requerimientoDetalle: null,

  estados: [
    { code: "PEND", label: "Pendiente aprobación", value: "1" },
    { code: "APRV", label: "Aprobado", value: "2" },
    { code: "EXEC", label: "En ejecución", value: "3" },
    { code: "RESC", label: "Resuelto cerrado", value: "4" },
    { code: "REJC", label: "Rechazado", value: "5" },
  ],
}

// getters
// const getters = {
//   areas: state => state.options.areas,
//   sistemas: state => state.options.sistemas,
//   requerimientosTipos: state => state.options.requerimientosTipos,
// }

const mutations = {
  SET_OPTIONS: (state, { areas, sistemas, requerimientos_tipos }) => {
    // state.options.areas = Vue.set(state.options, "areas", areas)
    state.options.areas = areas
    state.options.sistemas = sistemas
    state.options.requerimientosTipos = requerimientos_tipos
  },
  TOGGLE_LOADING_REQ: state => {
    state.loadingRequerimiento = !state.loadingRequerimiento
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
  SET_MIS_REQUERIMIENTOS: (state, misRequerimientos) => {
    state.misRequerimientos = misRequerimientos
  },
  SET_REQUERIMIENTO_DETALLE: (state, requerimientoDetalle) => {
    state.requerimientoDetalle = requerimientoDetalle
  },
}

const actions = {
  createRequerimiento({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      const { areas, sistemas, requerimientosTipos } = state.options
      commit("SET_LOADING_OPTS", true)
      commit("SET_LOADING_REQ", true)
      if (areas.length && sistemas.length && requerimientosTipos.length) {
        commit("SET_LOADING_OPTS", false)
        commit("SET_LOADING_REQ", false)
        resolve()
      } else {
        try {
          // destructuring value: https://medium.com/@pyrolistical/destructuring-nested-objects-9dabdd01a3b8
          const {
            data: { data },
          } = await createRequerimiento()
          commit("SET_OPTIONS", data)

          resolve()
        } catch (error) {
          reject(error)
        } finally {
          commit("SET_LOADING_OPTS", false)
          commit("SET_LOADING_REQ", false)
        }
      }
    })
  },
  storeRequerimiento({ commit }, requerimiento) {
    return new Promise(async (resolve, reject) => {
      commit("SET_LOADING_REQ", true)
      try {
        await storeRequerimiento(requerimiento)
        resolve()
      } catch (error) {
        reject(error)
      } finally {
        commit("SET_LOADING_REQ", false)
      }
    })
  },
  listRequerimientos({ commit, rootState }, userId = null) {
    return new Promise(async (resolve, reject) => {
      commit("SET_LOADING_REQ", true)
      try {
        let userRequerimientos = userId
        const actualUserId = _.get(rootState, "auth.user.Id", null)
        if (!userRequerimientos && actualUserId) {
          userRequerimientos = actualUserId
        }
        const {
          data: { data },
        } = await listRequerimientos(userRequerimientos)
        commit("SET_MIS_REQUERIMIENTOS", data)

        resolve()
      } catch (error) {
        reject(error)
      } finally {
        commit("SET_LOADING_REQ", false)
      }
    })
  },
  getRequerimiento({ commit }, requerimientoId = null) {
    return new Promise(async (resolve, reject) => {
      commit("SET_LOADING_REQ", true)
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
      }
    })
  },
}

export default {
  namespaced: true,
  state,
  // getters,
  mutations,
  actions,
}
