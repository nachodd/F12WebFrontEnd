import Cookies from "js-cookie"
import {
  getDashboardData,
  checkNotificaciones,
  readNotificaciones,
} from "@api/user"
import Notificacion from "@models/notificacion"
import { date } from "quasar"

const LIMIT_NOTIFICACIONES_SHOWED = 5

const state = {
  sidebarOpen: Cookies.get("sidebarStatus")
    ? !!+Cookies.get("sidebarStatus")
    : true,
  device: "desktop",
  size: Cookies.get("size") || "medium",
  loadingLevel: 0,
  dashboard: {
    asignados_ejecucion: 0,
    asignados_pendiente_ejecucion: 0,
    pendientes_asignacion: 0,
    pendientes_priorizacion: 0,
  },
  loadingDashboard: false,
  notificaciones: [],
  limitUnread: LIMIT_NOTIFICACIONES_SHOWED,
  limitRead: LIMIT_NOTIFICACIONES_SHOWED,
}

// getters
const getters = {
  sidebarOpen: state => state.sidebarOpen,
  device: state => state.device,
  size: state => state.size,
  isPageLoading: state => state.loadingLevel !== 0,
  notificacionesRead: state =>
    _(state.notificaciones)
      .filter({ leida: true })
      .orderBy(["_read_at"], ["desc"])
      .take(state.limitRead)
      .value(),
  notificacionesUnread: state =>
    _(state.notificaciones)
      .filter({ leida: false })
      .orderBy(["_read_at"], ["desc"])
      .take(state.limitUnread)
      .value(),
  notificacionesUnreadCount: state =>
    _.filter(state.notificaciones, { leida: false }).length,
  notificacionesReadCount: state =>
    _.filter(state.notificaciones, { leida: true }).length,
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
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set("size", size)
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
      pendientes_asignacion = null,
      pendientes_priorizacion = null,
    },
  ) => {
    state.dashboard.asignados_ejecucion = asignados_ejecucion
    state.dashboard.asignados_pendiente_ejecucion = asignados_pendiente_ejecucion
    state.dashboard.pendientes_asignacion = pendientes_asignacion
    state.dashboard.pendientes_priorizacion = pendientes_priorizacion
  },
  SET_LOADING_DASHBOARD: (state, value) => {
    state.loadingDashboard = value
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
        notificacion.read_at = date.formatDate(
          nr.notification_read_at,
          "HH:mm DD/MM",
        )
      }
    })
  },
  SET_LIMIT_NOTIFICACIONES_SHOWED: (
    state,
    { which, showMore = 3, reset = false },
  ) => {
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
  setSize({ commit }, size) {
    commit("SET_SIZE", size)
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
  getDashboardData({ commit }, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        commit("SET_LOADING_DASHBOARD", true)
        const res = await getDashboardData(userId)
        commit("SET_DASHBOARD_DATA", res)
        resolve()
      } catch (error) {
        reject(error)
      } finally {
        commit("SET_LOADING_DASHBOARD", false)
      }
    })
  },
  checkNotificaciones({ commit, rootGetters }, userId = null) {
    return new Promise(async (resolve, reject) => {
      try {
        const userIdToCheck = userId || rootGetters["auth/userId"]
        const res = await checkNotificaciones(userIdToCheck)
        commit("SET_NOTIFICACIONES", res)
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
        const res = await readNotificaciones(userIdToCheck)
        commit("SET_NOTIFICACIONES_READ", res)
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
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
