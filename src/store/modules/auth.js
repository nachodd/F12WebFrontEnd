import { login, logout, getInfo, refresh, getVinculacion } from "@api/user"
import {
  getToken,
  getExpiresIn,
  getRefreshToken,
  expiresToUnixTS,
  setToken,
  removeToken,
  mapRoles,
} from "@utils/auth"
import { resetRouter } from "@router"
import { getRoles } from "@api/user"
// import axios from "axios";
// import Cookies from "js-cookie";
// import * as types from "../mutation-types";

// state
const state = {
  token: getToken(),
  expiresIn: getExpiresIn(),
  refreshToken: getRefreshToken(),
  user: null,
  roles: [],
  vinculacion: {},
}

// getters
const getters = {
  token: state => state.token,
  expiresIn: state => state.expiresIn,
  refreshToken: state => state.refreshToken,
  user: state => state.user,
  userId: state => (state.user ? state.user.Id : null),
  roles: state => state.roles,
  check: state => state.user !== null,
  // userTreeLoaded: state => !_.isEmpty(state.vinculacion),
  userJefes: state => state.vinculacion && state.vinculacion.jefes,
  userReportantes: state => state.vinculacion && state.vinculacion.reportantes,
  hasJefes: (state, getters) =>
    getters.userJefes && getters.userJefes.length > 0,
  hasReportantes: (state, getters) =>
    getters.userReportantes && getters.userReportantes.length > 0,
  // Si no tiene reportantes, será el ultimo eslabon de la cadena de mando
  esElUltimoDeLaCadenaDeMando: (state, getters) => !getters.hasReportantes,
}

// mutations
const mutations = {
  SET_TOKEN: (state, { token, expiresIn, refreshToken = null }) => {
    state.token = token
    state.expiresIn = expiresIn
    if (refreshToken) {
      state.refreshToken = refreshToken
    }
  },
  CLEAR_TOKENS: state => {
    state.token = ""
    state.expiresIn = ""
    state.refreshToken = ""
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_VINCULACION: (state, vinculacion) => {
    state.vinculacion = vinculacion
  },
}

// actions
const actions = {
  // user login
  login({ commit }, userInfo) {
    // const { usuario, password } = userInfo;
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await login(userInfo)

        const expires = expiresToUnixTS(data.expires_in)
        commit("SET_TOKEN", {
          token: data.access_token,
          expiresIn: expires,
          refreshToken: data.refresh_token,
        })
        setToken(data.access_token, expires, data.refresh_token)

        const result_user = await getInfo()
        if (!result_user.data || !result_user.data.data) {
          reject("Verification failed, please Login again.")
        }
        const user = result_user.data.data

        const result_roles = await getRoles()
        if (!result_roles.data || !result_roles.data.data) {
          reject("Verification failed, please Login again.")
        }
        const roles = mapRoles(result_roles.data.data)
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject("getInfo: roles must be a non-null array!")
        }
        commit("SET_ROLES", roles)
        commit("SET_USER", user)

        // Busco el arbol de vinculacion directa (estructura de superiores - subordinados)
        const result_vinculacion = await getVinculacion(user.Id)
        commit("SET_VINCULACION", result_vinculacion)
        /* getVinculacion(user.Id)
          .then(tree => {
            debugger
            // const tree = res.data.data
            commit("SET_VINCULACION", tree)
          })
          .catch(e => console.log(e)) */

        resolve()
      } catch (error) {
        reject(error)
      }
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const result_user = await getInfo()
        if (!result_user.data || !result_user.data.data) {
          reject("Verification failed, please Login again.")
        }
        const user = result_user.data.data

        const result_roles = await getRoles()
        if (!result_roles.data || !result_roles.data.data) {
          reject("Verification failed, please Login again.")
        }
        const roles = mapRoles(result_roles.data.data)

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject("getInfo: roles must be a non-null array!")
        }

        const result_vinculacion = await getVinculacion(user.Id)

        commit("SET_ROLES", roles)
        commit("SET_USER", user)
        commit("SET_VINCULACION", result_vinculacion)

        resolve({
          user,
          roles,
        })
      } catch (error) {
        reject(error)
      }
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise(async (resolve, reject) => {
      // try to logout only if token is expired (becouse, token is needed to logout)
      if (state.token) {
        try {
          await logout()
        } catch (error) {
          // can't logout (ie token expired) => do nothing
        }
      }
      try {
        commit("CLEAR_TOKENS")
        commit("SET_ROLES", [])
        commit("SET_USER", null)
        commit("app/LOADING_RESET", null, { root: true })
        removeToken()
        resetRouter()
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("CLEAR_TOKENS")
      commit("SET_ROLES", [])
      commit("SET_USER", null)
      commit("app/LOADING_RESET", null, { root: true })
      removeToken()
      resolve()
    })
  },

  refresh({ commit, state, dispatch }) {
    return new Promise(async (resolve, reject) => {
      if (!state.refreshToken) {
        dispatch("logout")
        commit("app/LOADING_RESET", null, { root: true })
        reject()
      } else {
        try {
          const { data } = await refresh(state.refreshToken)

          const expires = expiresToUnixTS(data.expires_in)
          commit("SET_TOKEN", {
            token: data.access_token,
            expiresIn: expires,
            refreshToken: data.refresh_token,
          })
          setToken(data.access_token, expires, data.refresh_token)

          resolve()
        } catch (e) {
          await dispatch("resetToken")
          reject()
        }
      }
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
