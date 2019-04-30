import { createRequerimiento, storeRequerimiento } from "@api/requerimientos"

const state = {
  options: {
    areas: [],
    sistemas: [],
    requerimientosTipos: [],
  },
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
}

const actions = {
  createRequerimiento({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      const { areas, sistemas, requerimientosTipos } = state.options
      if (areas.length && sistemas.length && requerimientosTipos.length) {
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
        console.log(requerimiento)
        debugger
        const res = await storeRequerimiento(requerimiento)
        console.log(res)
        debugger
        // commit("SET_OPTIONS", data)
        //console.log(res)
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
