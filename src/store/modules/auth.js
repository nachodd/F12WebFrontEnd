import { login, logout, refresh, getUsuarioGestion } from "@api/user"
import {
  getToken,
  getExpiresIn,
  getRefreshToken,
  expiresToUnixTS,
  setToken,
  removeToken,
} from "@utils/auth"
import { resetRouter } from "@router"
// import * as types from "../mutation-types";

// state
const state = {
  token: getToken(),
  expiresIn: getExpiresIn(),
  refreshToken: getRefreshToken(),
  user: null,
  userArea: {},
  userVinculacion: {
    jefes: [],
    reportantes: [],
    pares: [],
  },
  userSistemas: [],
  // roles: [],
}

// getters
const getters = {
  token: state => state.token,
  expiresIn: state => state.expiresIn,
  refreshToken: state => state.refreshToken,
  user: state => state.user,
  userId: state => (state.user ? state.user.id : null),
  // roles: state => state.roles,
  check: state => state.user !== null,
  // userTreeLoaded: state => !_.isEmpty(state.userVinculacion),
  userJefes: state => state.userVinculacion && state.userVinculacion.jefes,
  userReportantes: state => {
    const userReps = _.get(state, "userVinculacion.reportantes", [])
    return _.map(userReps, ur => {
      return {
        label: ur.razon_social,
        value: ur.usuario_id,
      }
    })
  },
  userYoYReportantes: (state, getters) => {
    const ur = [...getters.userReportantes]
    const currentUser = state.user || {}
    ur.push({
      label: currentUser.razon_social,
      value: currentUser.id,
    })
    return _.orderBy(ur, ["label"], ["asc"])
  },
  userPares: state => {
    const userPares = _.get(state, "userVinculacion.pares", [])
    return _.map(userPares, ur => {
      return {
        label: ur.razon_social,
        value: ur.usuario_id,
      }
    })
  },
  userParesYReportantes: (state, getters) => {
    const users = [...getters.userReportantes, ...getters.userPares]
    return _.orderBy(users, ["label"], ["asc"])
  },
  hasJefes: (state, getters) =>
    getters.userJefes && getters.userJefes.length > 0,
  hasReportantes: (state, getters) =>
    getters.userReportantes && getters.userReportantes.length > 0,
  // Si no tiene reportantes, será el ultimo eslabon de la cadena de mando
  esElUltimoDeLaCadenaDeMando: (state, getters) => !getters.hasReportantes,
  userSistemas: state => state.userSistemas,
  userEsResponsable: state => state.userSistemas.length > 0,
  puedeVerRequerimientosAsignados: state =>
    _.filter([8, 16, 36, 37, 48], id => id == state.userArea.id).length > 0,
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
  SET_USER: (state, userData) => {
    if (userData === null) {
      state.user = null
      state.userArea = {}
      state.userVinculacion.jefes = []
      state.userVinculacion.reportantes = []
      state.userVinculacion.pares = []
      state.userSistemas = []
    } else {
      const user = {}
      {
        // Block assigment - next variables aren't valid outside this scope
        let { id, usuario, razon_social, numero_documento } = userData
        Object.assign(user, {
          id,
          usuario,
          razonSocial: razon_social,
          numeroDocumento: numero_documento,
        })
      }
      state.user = user
      state.userArea = userData.area
      state.userSistemas = userData.sistemas
      state.userVinculacion.jefes = userData.jefes
      state.userVinculacion.reportantes = userData.reportantes
      state.userVinculacion.pares = userData.pares
    }
  },
  // SET_ROLES: (state, roles) => {
  //   state.roles = roles
  // },
  // SET_VINCULACION: (state, vinculacion) => {
  //   state.vinculacion = vinculacion
  // },
  // SET_RESPONSABILIDADES: (state, responsabilidades) => {
  //   state.responsabilidades = responsabilidades
  // },
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

        /* const result_user = await getInfo()
        if (!result_user.data || !result_user.data.data) {
          reject("Verification failed, please Login again.")
        }
        const user = result_user.data.data
        commit("SET_USER", user)
        */

        /* const result_roles = await getRoles()
        if (!result_roles.data || !result_roles.data.data) {
          reject("Verification failed, please Login again.")
        }
        const roles = mapRoles(result_roles.data.data)
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject("getInfo: roles must be a non-null array!")
        }
        commit("SET_ROLES", roles) */

        // Busco el arbol de vinculacion directa (estructura de superiores - subordinados)
        // const result_vinculacion = await getVinculacion(user.Id)
        // commit("SET_VINCULACION", result_vinculacion)

        // const result_responsabilidades = await getResponsabilidades(user.Id)
        // commit("SET_RESPONSABILIDADES", result_responsabilidades)

        commit("app/FLUSH_NOTIFICACIONES", null, { root: true })

        const userData = await getUsuarioGestion()
        commit("SET_USER", userData)

        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        /* const result_user = await getInfo()
        if (!result_user.data || !result_user.data.data) {
          reject("Verification failed, please Login again.")
        }
        const user = result_user.data.data */

        /* const result_roles = await getRoles()
        if (!result_roles.data || !result_roles.data.data) {
          reject("Verification failed, please Login again.")
        }
        const roles = mapRoles(result_roles.data.data)
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject("getInfo: roles must be a non-null array!")
        }
        commit("SET_ROLES", roles)
        */
        // const result_vinculacion = await getVinculacion(user.Id)
        // const result_responsabilidades = await getResponsabilidades(user.Id)
        // commit("SET_USER", user)
        // commit("SET_VINCULACION", result_vinculacion)
        // commit("SET_RESPONSABILIDADES", result_responsabilidades)

        // resolve({
        //   user: state.user,
        //   sistemas: state.userSistemas,
        // })

        const userData = await getUsuarioGestion()
        commit("SET_USER", userData)

        resolve()
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
        // commit("SET_ROLES", [])
        // commit("SET_RESPONSABILIDADES", [])
        commit("SET_USER", null)
        commit("app/LOADING_RESET", null, { root: true })
        commit("app/FLUSH_NOTIFICACIONES", null, { root: true })
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
      // commit("SET_ROLES", [])
      // commit("SET_RESPONSABILIDADES", [])
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
