import { getOptionsForTicketCreate } from "src/api/tickets"

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
  SET_AREAS: (state, areas) => {
    state.options.areas = areas
  },
  SET_SISTEMAS: (state, sistemas) => {
    state.options.sistemas = sistemas
  },
  SET_REQUERIMIENTOS_TIPOS: (state, requerimientos_tipos) => {
    state.options.requerimientos_tipos = requerimientos_tipos
  },
  SET_OPTIONS: (state, { areas, sistemas, requerimientos_tipos }) => {
    // state.options.areas = Vue.set(state.options, "areas", areas)
    state.options.areas = areas
    state.options.sistemas = sistemas
    state.options.requerimientos_tipos = requerimientos_tipos
  },
}

const actions = {
  getOptionsForTicketCreate({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        // destructuring value: https://medium.com/@pyrolistical/destructuring-nested-objects-9dabdd01a3b8
        const {
          data: { data },
        } = await getOptionsForTicketCreate()
        commit("SET_OPTIONS", data)

        resolve()
      } catch (error) {
        debugger
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
