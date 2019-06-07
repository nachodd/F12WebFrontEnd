import {
  createRequerimiento,
  storeRequerimiento,
  listRequerimientos,
  getRequerimiento,
  updateRequerimiento,
} from "@api/requerimientos"

import Requerimiento from "@models/Requerimiento"

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
  detalleRequerimientoOpen: false,
  detalleRequerimientoItem: {},
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

  SET_DETALLE_REQUERIMIENTO_ITEM: (state, requerimiento) => {
    if (requerimiento) {
      state.detalleRequerimientoItem = new Requerimiento(requerimiento)
      // state.detalleRequerimientoItem = Object.assign(
      //   {},
      //   state.detalleRequerimientoItem,
      //   new Requerimiento(requerimiento),
      // )
    } else {
      state.detalleRequerimientoItem = null
    }
  },
  SET_DETALLE_REQUERIMIENTO_OPEN: (state, value) => {
    state.detalleRequerimientoOpen = value
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
        const actualUserId = _.get(rootState, "auth.user.id", null)
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

  abrirDetalleRequerimiento(
    { commit, state, rootState },
    { reqId, listName, fetchRequerimiento = false },
  ) {
    return new Promise(async (/* resolve, reject */) => {
      // Para seguir con la convencion de nombres, utilizo listType para la action

      let requerimiento = {}

      // fetchRequerimiento = false;

      if (fetchRequerimiento) {
        // cuando es true viene desde "mis-requerimientos" cambiar nombre de la variable
        let list = state.misRequerimientos
        requerimiento = _.find(list, { id: reqId })
      } else {
        let listType = listName === "source" ? "pending" : "approved"

        let reqsPendientesAprobacion = _.get(
          rootState,
          "priorizarRequerimientos.reqsPendientesAprobacion",
          null,
        )

        let reqsAprobadosPriorizados = _.get(
          rootState,
          "priorizarRequerimientos.reqsAprobadosPriorizados",
          null,
        )
        const list =
          listType === "pending"
            ? reqsPendientesAprobacion.list
            : reqsAprobadosPriorizados.list

        requerimiento = _.find(list, { id: reqId })
      }

      if (requerimiento) {
        commit("SET_DETALLE_REQUERIMIENTO_ITEM", requerimiento)
      } else {
        commit("SET_DETALLE_REQUERIMIENTO_ITEM", {})
      }

      if (state.detalleRequerimientoItem) {
        commit("SET_DETALLE_REQUERIMIENTO_OPEN", true)
      }
    })
  },

  setDetalleRequerimientoOpen({ commit }, value) {
    return new Promise(resolve => {
      commit("SET_DETALLE_REQUERIMIENTO_OPEN", value)
      // si está cerrando, borro el requerimiento detalle
      if (!value) {
        commit("SET_DETALLE_REQUERIMIENTO_ITEM", null)
      }
      resolve()
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
