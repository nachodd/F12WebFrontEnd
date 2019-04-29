import { createRequerimiento, storeRequerimiento } from "src/api/tickets"

const state = {
  options: {
    areas: [],
    sistemas: [],
    requerimientos_tipos: [],
  },
}

// getters
// const getters = {
//   areas: state => state.options.areas,
//   sistemas: state => state.options.sistemas,
//   requerimientos_tipos: state => state.options.requerimientos_tipos,
// }

const mutations = {
  SET_OPTIONS: (state, { areas, sistemas, requerimientos_tipos }) => {
    // state.options.areas = Vue.set(state.options, "areas", areas)
    state.options.areas = areas
    state.options.sistemas = sistemas
    state.options.requerimientos_tipos = requerimientos_tipos
  },
}

const actions = {
  createRequerimiento({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      const { areas, sistemas, requerimientos_tipos } = state.options
      if (areas.length && sistemas.length && requerimientos_tipos.length) {
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
        }
      }
    })
  },
  storeRequerimiento(state, requerimiento) {
    return new Promise(async (resolve, reject) => {
      try {
        debugger
        const res = await storeRequerimiento(requerimiento)
        // commit("SET_OPTIONS", data)
        console.log(res)
        resolve()
      } catch (error) {
        reject(error)
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
