import Cookies from "js-cookie"

const state = {
  sidebarOpen: Cookies.get("sidebarStatus")
    ? !!+Cookies.get("sidebarStatus")
    : true,
  device: "desktop",
  size: Cookies.get("size") || "medium",
}

// getters
const getters = {
  sidebarOpen: state => state.sidebarOpen,
  device: state => state.device,
  size: state => state.size,
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
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set("size", size)
  },
}

const actions = {
  toggleSidebar({ commit }) {
    commit("TOGGLE_SIDEBAR")
  },
  closeSideBar({ commit }) {
    commit("CLOSE_SIDEBAR")
  },
  toggleDevice({ commit }, device) {
    commit("TOGGLE_DEVICE", device)
  },
  setSize({ commit }, size) {
    commit("SET_SIZE", size)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
