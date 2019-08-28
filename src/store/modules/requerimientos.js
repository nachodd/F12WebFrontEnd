import {
  createRequerimiento,
  storeRequerimiento,
  listRequerimientos,
  getRequerimiento,
  updateRequerimiento,
  getGerentes,
} from "api/requerimientos"

import Requerimiento from "models/requerimiento"
import router from "router/index"

const state = {
  // Create
  options: {
    areas: [],
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
    // { codigo: "INGR", descripcion: "Ingresado", id: 8 },
    { codigo: "STPR", descripcion: "Pasado a procesos", id: 9 }, // sent to process
    { codigo: "TEST", descripcion: "Testing", id: 10 },
  ],
  misRequerimientos: [],
  misRequerimientosSearchMeta: {},
  misRequerimientosHuboCambio: false,
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
  // detalleRequerimientoEstado: state => {
  //   const idEstado = _.get(state, "detalleRequerimientoItem.estado.id", false)
  //   return idEstado ? Requerimiento.getEstadoCodigo(idEstado) : null
  // },
  // detalleRequerimientoEstadoPriorizacion: state => {
  //   const idEstadoPriorizacion = _.get(
  //     state,
  //     "detalleRequerimientoItem.estado_priorizacion.id",
  //     false,
  //   )
  //   return idEstadoPriorizacion
  //     ? Requerimiento.getEstadoCodigo(idEstadoPriorizacion)
  //     : null
  // },
  // detalleRequerimientoId: state => {
  //   return _.get(state, "detalleRequerimientoItem.id", null)
  // },
  optionsEstados: state =>
    _(state.estados)
      .map(estado => ({
        label: estado.descripcion,
        value: estado.id,
      }))
      .orderBy("label")
      .value(),
  optionsReqTiposAlta: state =>
    _.filter(state.options.requerimientosTipos, rt => {
      return rt.id === 1 || rt.id === 2
    }),
}

const mutations = {
  SET_OPTIONS: (state, { areas, sistemas, requerimientos_tipos }) => {
    // state.options.areas = Vue.set(state.options, "areas", areas)
    state.options.areas = areas
    state.options.sistemas = sistemas
    // const reqTiposFiltered = _.filter(requerimientos_tipos, rt => {
    //   return rt.id === 1 || rt.id === 2
    // })
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

  SET_MIS_REQUERIMIENTOS: (state, { requerimientos, meta }) => {
    state.misRequerimientos = _.map(requerimientos, req => req)
    state.misRequerimientosSearchMeta = meta
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
  SET_MIS_REQUERIMIENTOS_HUBO_CAMBIOS(state, value) {
    state.misRequerimientosHuboCambio = value
  },
  PUSHER_PROCESS_UPDATE: (state, { showHuboCambioMsg, reqInCurrentList, requerimiento }) => {
    state.misRequerimientosHuboCambio = showHuboCambioMsg
    // state.misRequerimientosHuboCambio = true
    if (reqInCurrentList) {
      const removedIndex = _.findIndex(state.misRequerimientos, {
        id: requerimiento.id,
      })
      state.misRequerimientos.splice(removedIndex, 1, requerimiento)
    }
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
          const res = await updateRequerimiento(requerimiento, requerimiento.id)
          // Obtenemos el req actualizado, y lo actualizamos en las stores correspondientes:
          const req = _.get(res, "data.data", null)
          if (req) {
            const payload = { operation: "update", req }
            const root = { root: true }
            // eslint-disable-next-line
            commit("asignacionRequerimientos/PUSHER_UPDATE_REQUERIMIENTO", payload, root)
            // eslint-disable-next-line
            commit("priorizarRequerimientos/PUSHER_UPDATE_REQUERIMIENTO", payload, root)
            // eslint-disable-next-line
            commit("requerimientosAsignados/PUSHER_UPDATE_REQUERIMIENTO", payload, root)
          }
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
  listRequerimientos({ commit, rootGetters }, { userId = null, filtros }) {
    return new Promise(async (resolve, reject) => {
      commit("SET_LOADING_REQ", true)
      commit("app/LOADING_INC", null, { root: true })
      try {
        let userRequerimientos = userId ? userId : rootGetters["auth/userId"]
        const {
          data: { data, meta },
        } = await listRequerimientos(userRequerimientos, filtros)

        commit("SET_MIS_REQUERIMIENTOS", {
          requerimientos: data,
          meta,
        })
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

  setDetalleRequerimiento({ commit, state, rootState }, { reqId, listName }) {
    return new Promise(async resolve => {
      // Para seguir con la convencion de nombres, utilizo listType para la action
      let requerimiento = {}

      if (listName === "mis-requerimientos") {
        // cuando es true viene desde "mis-requerimientos" cambiar nombre de la variable
        let reqList = state.misRequerimientos
        requerimiento = _.find(reqList, { id: reqId })
      } else if (listName === "priorizar-requerimientos") {
        let reqList = _.get(rootState, "priorizarRequerimientos.requerimientos", null)
        requerimiento = _.find(reqList, { id: reqId })
      } else if (listName === "asignar-requerimientos") {
        let reqList = _.get(rootState, "asignacionRequerimientos.requerimientos", null)
        requerimiento = _.find(reqList, { id: reqId })
      } else if (listName === "requerimientos-asignados") {
        let reqList = _.get(rootState, "requerimientosAsignados.requerimientos", null)
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

  setMisRequerimientosHuboCambios({ commit }, value) {
    return new Promise(resolve => {
      commit("SET_MIS_REQUERIMIENTOS_HUBO_CAMBIOS", value)
      resolve()
    })
  },

  initFiltrosMisRequerimientos({ commit, dispatch }) {
    return new Promise(async resolve => {
      commit("app/LOADING_INC", null, { root: true })
      await dispatch("createRequerimiento")
      await dispatch("auth/getUsuariosFiltro", null, { root: true })
      commit("app/LOADING_DEC", null, { root: true })
      resolve()
    })
  },

  pusherUpdateMisRequerimientos({ commit, state }, { requerimiento, showMessage = true }) {
    return new Promise(resolve => {
      // chequeo si se debe mostrar el mensaje de "algo cambio" (solo si esta en la pagina)
      // se mostrará si showMessage===true y la pagina es "mis-requerimientos"
      const showHuboCambioMsg = showMessage && router.currentRoute.name === "mis-requerimientos"
      // chequeo si el req en cuestion está en la vista actual de mis reqs, para saber si lo tengo que actualizar
      const reqInCurrentList = _.find(state.misRequerimientos, {
        id: requerimiento.id,
      })
      commit("PUSHER_PROCESS_UPDATE", {
        showHuboCambioMsg,
        reqInCurrentList,
        requerimiento,
      })
      resolve()
    })
  },
  pusherUpdateDetalleRequerimientoItem({ commit, state }, requerimiento) {
    return new Promise(resolve => {
      // chequeo si el detalle está abierto y si es así, lo actualizo
      const currentReqOpened = _.get(state.detalleRequerimientoItem, "id", null)
      if (currentReqOpened === requerimiento.id) {
        commit("SET_DETALLE_REQUERIMIENTO_ITEM", requerimiento)
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
