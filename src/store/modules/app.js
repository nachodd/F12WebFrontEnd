import Cookies from "js-cookie"
import {
  getDashboardData,
  getNotificaciones,
  readNotificaciones,
} from "@api/user"

const state = {
  sidebarOpen: Cookies.get("sidebarStatus")
    ? !!+Cookies.get("sidebarStatus")
    : true,
  device: "desktop",
  size: Cookies.get("size") || "medium",
  loadingLevel: 0,
  dashboard: {},
  loadingDashboard: false,
  notificaciones: [],
  loadingNotificaciones: false,
}

// getters
const getters = {
  sidebarOpen: state => state.sidebarOpen,
  device: state => state.device,
  size: state => state.size,
  isPageLoading: state => state.loadingLevel !== 0,
  notificacionesUnread: state =>
    _.filter(state.notificaciones, not => {
      return not.notification_read_at === null
    }),
  notificacionesRead: state =>
    _.filter(state.notificaciones, not => {
      return not.notification_read_at !== null
    }),
  notificacionesAll: state =>
    _.orderBy(state.notificaciones, ["notification_read_at.fecha"], ["desc"]),
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
  SET_DASHBOARD_DATA: (state, dashboard) => {
    state.dashboard = dashboard
  },
  SET_LOADING_DASHBOARD: (state, value) => {
    state.loadingDashboard = value
  },
  SET_LOADING_NOTIFICACIONES: (state, value) => {
    state.loadingNotificaciones = value
  },
  SET_NOTIFICACIONES: (state, value) => {
    if (value === null) {
      state.notificaciones.splice(0, state.notificaciones.length)
    } else {
      state.notificaciones.push(value)
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
  getNotificaciones({ commit, rootGetters }, userId = null) {
    return new Promise(async (resolve, reject) => {
      try {
        const userIdToCheck = userId || rootGetters["auth/userId"]
        commit("SET_LOADING_NOTIFICACIONES", true)
        const res = await getNotificaciones(userIdToCheck)
        commit("SET_NOTIFICACIONES", res)
        resolve()
      } catch (error) {
        reject(error)
      } finally {
        commit("SET_LOADING_NOTIFICACIONES", false)
      }
    })
  },
  readNotificaciones({ commit, rootGetters }, userId = null) {
    return new Promise(async (resolve, reject) => {
      try {
        const userIdToCheck = userId || rootGetters["auth/userId"]
        commit("SET_LOADING_NOTIFICACIONES", true)
        const res = await readNotificaciones(userIdToCheck)
        setTimeout(() => {
          commit("SET_NOTIFICACIONES", res)
        }, 5000)
        resolve()
      } catch (error) {
        reject(error)
      } finally {
        commit("SET_LOADING_NOTIFICACIONES", false)
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
