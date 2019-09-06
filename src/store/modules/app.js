import Cookies from "js-cookie"
import { getDashboardData, checkNotificaciones, readNotificaciones } from "api/user"
import Notificacion from "models/notificacion"
import { date } from "quasar"
import {
  getPusherChannel,
  destroyPusherChannel,
  processAsignarRequerimiento,
  processRequerimientoEnviadoAProcesos,
  processRequerimientoDesasignado,
  processRequerimientoAsignado,
  processEjecutarOCancelarEjecucionRequerimiento,
  processCancelaTestingRequerimiento,
  processCambioTipoRequerimiento,
  processRequerimientoFinalizado,
  processPriorizarRequerimiento,
  processPriorizarRequerimientoAprobado,
  processAgregaRequerimientoCreadoPriorizacion,
  processRequerimientoAprobado,
  processRequerimientoRechazado,
  processPausarReanudarRequerimiento,
} from "utils/pusher"
import router from "router/index"
import Bus from "utils/bus"

const LIMIT_NOTIFICACIONES_SHOWED = 5

const state = {
  sidebarOpen: Cookies.get("sidebarStatus") ? !!+Cookies.get("sidebarStatus") : true,
  device: "desktop",
  loadingLevel: 0,
  dashboard: {
    asignados_ejecucion: 0,
    asignados_pendiente_ejecucion: 0,
    asignados_testing: 0,
    pendientes_asignacion: 0,
    pendientes_priorizacion: 0,
  },
  loadingDashboard: true,
  notificaciones: [],
  limitUnread: LIMIT_NOTIFICACIONES_SHOWED,
  limitRead: LIMIT_NOTIFICACIONES_SHOWED,
  headerRefreshLoading: false,
  justCalledNotifAndDashboard: false,
}

// getters
const getters = {
  sidebarOpen: state => state.sidebarOpen,
  device: state => state.device,
  isPageLoading: state => state.loadingLevel !== 0,
  dashboardAsignadosYEjecutando: state => {
    return state.dashboard.asignados_pendiente_ejecucion + state.dashboard.asignados_ejecucion
  },

  notificacionesRead: state =>
    _(state.notificaciones)
      .filter({ leida: true })
      .orderBy(["_created_at"], ["desc"])
      .take(state.limitRead)
      .value(),
  notificacionesUnread: state =>
    _(state.notificaciones)
      .filter({ leida: false })
      .orderBy(["_created_at"], ["desc"])
      .take(state.limitUnread)
      .value(),
  notificacionesUnreadCount: state => _.filter(state.notificaciones, { leida: false }).length,
  notificacionesReadCount: state => _.filter(state.notificaciones, { leida: true }).length,
  notificacionesUnreadVerMasShowed: (state, getters) =>
    state.limitUnread < getters.notificacionesUnreadCount,
  notificacionesReadVerMasShowed: (state, getters) =>
    state.limitRead < getters.notificacionesReadCount,
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebarOpen = !state.sidebarOpen
    if (state.sidebarOpen) {
      Cookies.set("sidebarStatus", 1)
    } else {
      Cookies.set("sidebarStatus", 0)
    }
  },
  CLOSE_SIDEBAR: state => {
    Cookies.set("sidebarStatus", 0)
    state.sidebarOpen = false
  },
  SET_SIDEBAR: (state, status) => {
    Cookies.set("sidebarStatus", +status)
    state.sidebarOpen = status
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  LOADING_INC: state => {
    state.loadingLevel += 1
  },
  LOADING_INC_BY: (state, value) => {
    state.loadingLevel += value
  },
  LOADING_DEC: state => {
    state.loadingLevel -= 1
    if (state.loadingLevel < 0) {
      state.loadingLevel = 0
    }
  },
  LOADING_RESET: state => {
    state.loadingLevel = 0
  },
  SET_DASHBOARD_DATA: (
    state,
    {
      asignados_ejecucion = null,
      asignados_pendiente_ejecucion = null,
      asignados_testing = null,
      pendientes_asignacion = null,
      pendientes_priorizacion = null,
    },
  ) => {
    state.dashboard.asignados_ejecucion = asignados_ejecucion
    state.dashboard.asignados_pendiente_ejecucion = asignados_pendiente_ejecucion
    state.dashboard.asignados_testing = asignados_testing
    state.dashboard.pendientes_asignacion = pendientes_asignacion
    state.dashboard.pendientes_priorizacion = pendientes_priorizacion
  },
  SET_LOADING_DASHBOARD: (state, value) => {
    state.loadingDashboard = value
  },
  FLUSH_NOTIFICACIONES: state => {
    state.notificaciones = []
    state.dashboard.asignados_ejecucion = 0
    state.dashboard.asignados_pendiente_ejecucion = 0
    state.dashboard.asignados_testing = 0
    state.dashboard.pendientes_asignacion = 0
    state.dashboard.pendientes_priorizacion = 0
    state.loadingDashboard = false
  },
  SET_NOTIFICACIONES: (state, notificaciones) => {
    _.each(notificaciones, n => {
      const index = _.findIndex(state.notificaciones, {
        id: n.notification_id,
      })
      if (-1 === index) {
        state.notificaciones.push(new Notificacion(n))
      }
    })
  },
  SET_NOTIFICACIONES_READ: (state, notificacionesRead) => {
    _.each(notificacionesRead, nr => {
      // busco la notificacion en el array y la actualizo el tiempo de leido
      const notificacion = _.find(state.notificaciones, {
        id: nr.notification_id,
      })
      if (notificacion) {
        notificacion._read_at = nr.notification_read_at
        notificacion.read_at = date.formatDate(nr.notification_read_at, "HH:mm DD/MM")
      }
    })
  },
  SET_LIMIT_NOTIFICACIONES_SHOWED: (state, { which, showMore = 3, reset = false }) => {
    if (reset) {
      state.limitUnread = LIMIT_NOTIFICACIONES_SHOWED
      state.limitRead = LIMIT_NOTIFICACIONES_SHOWED
    } else {
      if (which === "unread") {
        state.limitUnread = state.limitUnread + showMore
      } else {
        state.limitRead = state.limitRead + showMore
      }
    }
  },
  SET_HEADER_REFRESH_LOADING: (state, value) => {
    state.headerRefreshLoading = value
  },
  SET_JUST_CALLED_NOTIF_DASHBOARD: (state, value) => {
    state.justCalledNotifAndDashboard = value
  },
}

const actions = {
  toggleSidebar({ commit }) {
    commit("TOGGLE_SIDEBAR")
  },
  closeSideBar({ commit }) {
    commit("CLOSE_SIDEBAR")
  },
  setSideBar({ commit }, sidebarStatus) {
    commit("SET_SIDEBAR", sidebarStatus)
  },
  toggleDevice({ commit }, device) {
    commit("TOGGLE_DEVICE", device)
  },
  loadingInc({ commit }) {
    return new Promise(async resolve => {
      commit("LOADING_INC")
      resolve()
    })
  },
  loadingIncBy({ commit }, value) {
    commit("LOADING_INC_BY", value)
  },
  loadingDec({ commit }) {
    return new Promise(async resolve => {
      commit("LOADING_DEC")
      resolve()
    })
  },
  loadingReset({ commit }) {
    commit("LOADING_RESET")
  },
  getDashboardData: ({ state, commit, rootGetters }, userId = null) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!state.justCalledNotifAndDashboard) {
          commit("SET_LOADING_DASHBOARD", true)
          const userIdToCheck = userId ? userId : rootGetters["auth/userId"]
          if (userIdToCheck) {
            const res = await getDashboardData(userIdToCheck)
            commit("SET_DASHBOARD_DATA", res)
          }
        }
        resolve()
      } catch (error) {
        reject(error)
      } finally {
        commit("SET_LOADING_DASHBOARD", false)
      }
    })
  },
  checkNotificaciones: ({ state, commit, rootGetters }, userId = null) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!state.justCalledNotifAndDashboard) {
          const userIdToCheck = userId || rootGetters["auth/userId"]
          if (userIdToCheck) {
            const res = await checkNotificaciones(userIdToCheck)
            commit("SET_NOTIFICACIONES", res)
          }
        }
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  },
  readNotificaciones({ commit, rootGetters }, userId = null) {
    return new Promise(async (resolve, reject) => {
      try {
        const userIdToCheck = userId || rootGetters["auth/userId"]
        if (userIdToCheck) {
          const res = await readNotificaciones(userIdToCheck)
          commit("SET_NOTIFICACIONES_READ", res)
        }
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  },
  showMoreNotificaciones({ commit }, which) {
    return new Promise(resolve => {
      commit("SET_LIMIT_NOTIFICACIONES_SHOWED", {
        which,
        showMore: LIMIT_NOTIFICACIONES_SHOWED,
      })
      resolve()
    })
  },
  resetMoreNotificaciones({ commit }) {
    return new Promise(resolve => {
      commit("SET_LIMIT_NOTIFICACIONES_SHOWED", {
        reset: true,
      })
      resolve()
    })
  },
  async checkNotificacionesYDashboard({ dispatch, commit }) {
    await dispatch("checkNotificaciones")
    await dispatch("getDashboardData")
    commit("SET_JUST_CALLED_NOTIF_DASHBOARD", true)
    setTimeout(() => {
      commit("SET_JUST_CALLED_NOTIF_DASHBOARD", false)
    }, 10000)
  },
  initPusher(ctx, pusherChannelName) {
    return new Promise(resolve => {
      const pc = getPusherChannel(pusherChannelName)

      pc.bind("asignar_requerimiento", data => {
        processAsignarRequerimiento(ctx, data)
      })
      // usamos el mismo process para requerimiento externo (ya que basicamente, el comportamiento es el mismo)
      pc.bind("asignar_requerimiento_externo", data => {
        processAsignarRequerimiento(ctx, data)
      })
      pc.bind("requerimiento_enviado_a_procesos", data => {
        processRequerimientoEnviadoAProcesos(ctx, data)
      })
      pc.bind("requerimiento_asignado", data => {
        processRequerimientoAsignado(ctx, data)
      })
      pc.bind("requerimiento_asignado_testing", data => {
        processRequerimientoAsignado(ctx, data)
      })
      pc.bind("requerimiento_desasignado", data => {
        processRequerimientoDesasignado(ctx, data)
      })
      pc.bind("ejecutar_requerimiento", data => {
        processEjecutarOCancelarEjecucionRequerimiento(ctx, data)
      })
      pc.bind("cancela_ejecucion_requerimiento", data => {
        processEjecutarOCancelarEjecucionRequerimiento(ctx, data)
      })
      pc.bind("cancela_testing_requerimiento", data => {
        processCancelaTestingRequerimiento(ctx, data)
      })
      pc.bind("cambio_tipo_requerimiento", data => {
        processCambioTipoRequerimiento(ctx, data)
      })
      pc.bind("requerimiento_finalizado", data => {
        processRequerimientoFinalizado(ctx, data)
      })
      pc.bind("priorizar_requerimiento", data => {
        processPriorizarRequerimiento(ctx, data)
      })
      pc.bind("priorizacion_requerimiento_aprobado", data => {
        processPriorizarRequerimientoAprobado(ctx, data)
      })
      pc.bind("agrega_requerimiento_creado_priorizacion", data => {
        processAgregaRequerimientoCreadoPriorizacion(ctx, data)
      })
      pc.bind("requerimiento_aprobado", data => {
        processRequerimientoAprobado(ctx, data)
      })
      pc.bind("requerimiento_rechazado", data => {
        processRequerimientoRechazado(ctx, data)
      })

      pc.bind("pausar_requerimiento", data => {
        processPausarReanudarRequerimiento(ctx, data)
      })
      pc.bind("reanudar_requerimiento", data => {
        processPausarReanudarRequerimiento(ctx, data)
      })

      resolve()
    })
  },
  destroyPusher(ctx, pusherChannelName) {
    return new Promise(resolve => {
      destroyPusherChannel(pusherChannelName)
      resolve()
    })
  },
  async refreshListado({ commit, dispatch }) {
    const routeName = router.currentRoute.name
    const routeMatched = [
      "mis-requerimientos",
      "priorizar-requerimientos",
      "asignar-requerimientos",
      "requerimientos-asignados",
    ].includes(routeName)

    if (routeMatched) {
      commit("SET_HEADER_REFRESH_LOADING", true)
      // FIXME: reemplazar esto por llamadas a cada store correspondiente (cuando se pasen los filterValues corresp a cada store)
      switch (routeName) {
        case "mis-requerimientos":
          Bus.$emit("load-mis-requerimientos")
          break
        case "priorizar-requerimientos":
          // eslint-disable-next-line
          await dispatch("priorizarRequerimientos/inicializarPriorizarRequerimientos", { useLastUser: true }, { root: true })
          break
        case "asignar-requerimientos":
          await dispatch("asignacionRequerimientos/fetchRequerimientos", null, { root: true })
          break
        case "requerimientos-asignados":
          await dispatch("requerimientosAsignados/inicializarRequerimientosAsignados", null, {
            root: true,
          })
          // Bus.$emit("load-requerimientos-asignados")
          break
      }

      commit("SET_HEADER_REFRESH_LOADING", false)
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
