import {
  createRequerimiento,
  storeRequerimiento,
  listRequerimientos,
  getRequerimiento,
  updateRequerimiento,
  getGerentes,
} from "api/requerimientos"

import Requerimiento from "models/requerimiento"

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
    { codigo: "PEND", descripcion: "Pendiente aprobación", id: 1 },
    { codigo: "APRV", descripcion: "Aprobado", id: 2 },
    { codigo: "NOAS", descripcion: "Sin Asignar", id: 3 },
    { codigo: "ASSI", descripcion: "Asignado", id: 4 },
    { codigo: "EXEC", descripcion: "En ejecución", id: 5 },
    { codigo: "RESC", descripcion: "Resuelto cerrado", id: 6 },
    { codigo: "REJC", descripcion: "Rechazado", id: 7 },
    { codigo: "INGR", descripcion: "Ingresado", id: 8 },
    { codigo: "STPR", descripcion: "Pasado a procesos", id: 9 }, // sent to process
    { codigo: "TEST", descripcion: "Testing", id: 10 },
  ],
  misRequerimientos: [],
  detalleRequerimientoOpen: false,
  detalleRequerimientoItem: {},
  procesandoArchivosCargados: false,
}

// getters
const getters = {
  getEstadoByCodigo(state) {
    return codigo => _.find(state.estados, { codigo })
  },
  getEstadoById(state) {
    return id => _.find(state.estados, { id })
  },
  detalleRequerimientoState: state => {
    if (
      state.detalleRequerimientoItem &&
      state.detalleRequerimientoItem.estado
    ) {
      return _.find(state.estados, {
        id: state.detalleRequerimientoItem.estado.id,
      }).codigo
    }
    return null
  },
  detalleRequerimientoId: state => {
    return _.get(state, "detalleRequerimientoItem.id", null)
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
      if (requerimiento instanceof Requerimiento) {
        state.detalleRequerimientoItem = requerimiento
      } else {
        state.detalleRequerimientoItem = new Requerimiento(requerimiento)
      }
    } else {
      state.detalleRequerimientoItem = null
    }
  },
  SET_DETALLE_REQUERIMIENTO_OPEN: (state, value) => {
    state.detalleRequerimientoOpen = value
  },
  SET_PROCESANDO_ARCHIVOS_CARGADOS: (state, value) => {
    state.procesandoArchivosCargados = value
  },
}

const actions = {
  createRequerimiento({ commit, rootGetters, state, rootState }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { sistemas, requerimientosTipos } = state.options
        commit("SET_LOADING_OPTS", true)
        commit("SET_LOADING_REQ", true)
        commit("app/LOADING_INC", null, { root: true })

        if (sistemas.length === 0 && requerimientosTipos.length === 0) {
          // destructuring value: https://medium.com/@pyrolistical/destructuring-nested-objects-9dabdd01a3b8
          const { data } = await createRequerimiento()
          commit("SET_OPTIONS", data)
        }

        const isSisOProc = rootGetters["auth/esDeSistemasOProcesos"]
        if (isSisOProc && rootState.auth.gerentes.length === 0) {
          const gerentes = await getGerentes()
          commit("auth/SET_GERENTES", gerentes, { root: true })
        }
        resolve()
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
  listRequerimientos({ commit, rootState }, { userId = null, filtros }) {
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
          data: { data, meta },
        } = await listRequerimientos(userRequerimientos, filtros)

        commit("SET_MIS_REQUERIMIENTOS", data)

        resolve(meta)
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

  setDetalleRequerimiento({ commit, state, rootState }, { reqId, listName }) {
    return new Promise(async resolve => {
      // Para seguir con la convencion de nombres, utilizo listType para la action
      let requerimiento = {}

      if (listName === "mis-requerimientos") {
        // cuando es true viene desde "mis-requerimientos" cambiar nombre de la variable
        let reqList = state.misRequerimientos
        requerimiento = _.find(reqList, { id: reqId })
      } else if (listName === "priorizar-requerimientos") {
        let reqList = _.get(
          rootState,
          "priorizarRequerimientos.requerimientos",
          null,
        )
        requerimiento = _.find(reqList, { id: reqId })
      } else if (listName === "asignar-requerimientos") {
        let reqList = _.get(
          rootState,
          "asignacionRequerimientos.requerimientos",
          null,
        )
        requerimiento = _.find(reqList, { id: reqId })
      } else if (listName === "requerimientos-asignados") {
        let reqList = _.get(
          rootState,
          "requerimientosAsignados.requerimientos",
          null,
        )
        requerimiento = _.find(reqList, { id: reqId })
      }
      // else if (
      //   // detalle desde vista de Requerimientos Asignados
      //   listName === "reqsAsignadosPendientes" ||
      //   listName === "reqsAsignadosEnEjecucion"
      // ) {
      //   let reqList = _.get(
      //     rootState,
      //     `requerimientosAsignados.${listName}`,
      //     null,
      //   )
      //   requerimiento = _.find(reqList.list, { id: reqId })
      // }

      if (requerimiento) {
        commit("SET_DETALLE_REQUERIMIENTO_ITEM", requerimiento)
      } else {
        commit("SET_DETALLE_REQUERIMIENTO_ITEM", {})
      }

      resolve()
    })
  },
  abrirDetalleRequerimiento({ commit, state, dispatch }, { reqId, listName }) {
    return new Promise(async resolve => {
      await dispatch("setDetalleRequerimiento", { reqId, listName })

      if (state.detalleRequerimientoItem) {
        commit("SET_DETALLE_REQUERIMIENTO_OPEN", true)
      }
      resolve()
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
  setProcesandoArchivosCargados({ commit }, value) {
    return new Promise(resolve => {
      commit("SET_PROCESANDO_ARCHIVOS_CARGADOS", value)
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
