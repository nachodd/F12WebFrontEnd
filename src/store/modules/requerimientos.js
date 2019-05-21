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
    { codigo: "PEND", descripcion: "Pendiente aprobación", id: "1" },
    { codigo: "APRV", descripcion: "Aprobado", id: "2" },
    { codigo: "EXEC", descripcion: "En ejecución", id: "3" },
    { codigo: "RESC", descripcion: "Resuelto cerrado", id: "4" },
    { codigo: "REJC", descripcion: "Rechazado", id: "5" },
  ],
}

// getters
const getters = {
  getEstadoByCodigo(state) {
    return codigo => _.find(state.estados, { codigo })
  },
}

const mutations = {
  SET_OPTIONS: (state, { areas, sistemas, requerimientos_tipos }) => {
    // state.options.areas = Vue.set(state.options, "areas", areas)
    state.options.areas = areas
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
      commit("app/LOADING_INC", null, { root: true })
      if (areas.length && sistemas.length && requerimientosTipos.length) {
        commit("SET_LOADING_OPTS", false)
        commit("SET_LOADING_REQ", false)
        commit("app/LOADING_DEC", null, { root: true })
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
          commit("app/LOADING_DEC", null, { root: true })
        }
      }
    })
  },
  storeRequerimiento({ commit }, requerimiento) {
    return new Promise(async (resolve, reject) => {
      commit("SET_LOADING_REQ", true)
      commit("app/LOADING_INC", null, { root: true })
      try {
        await storeRequerimiento(requerimiento)
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
