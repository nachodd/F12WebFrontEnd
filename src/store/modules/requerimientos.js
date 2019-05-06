import { createRequerimiento, storeRequerimiento } from "@api/requerimientos"

const state = {
  options: {
    areas: [],
    sistemas: [],
    requerimientosTipos: [],
  },
  loadingOptions: true,
  loadingRequerimiento: true,
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
        console.log(requerimiento)
        const res = await storeRequerimiento(requerimiento)
        console.log(res)
        debugger
        resolve()
      } catch (error) {
        console.log(error)
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
