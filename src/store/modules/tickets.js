import { getOptionsForTicketCreate } from "src/api/tickets"

const state = {
  options: {
    areas: null,
    sistemas: null,
    requerimientos_tipos: null,
  },
}

// getters
const getters = {
  areas: state => state.options.areas,
  sistemas: state => state.options.sistemas,
  requerimientos_tipos: state => state.options.requerimientos_tipos,
}

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
  SET_OPTIONS: (state, areas, sistemas, requerimientos_tipos) => {
    state.options.areas = areas
    state.options.sistemas = sistemas
    state.options.requerimientos_tipos = requerimientos_tipos
  },
}

const actions = {
  getOptionsForTicketCreate({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await getOptionsForTicketCreate()

        commit(
          "SET_OPTIONS",
          data.areas,
          data.sistemas,
          data.requerimientos_tipos,
        )

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
  getters,
  mutations,
  actions,
}
