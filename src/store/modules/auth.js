import { login, logout, refresh, getUsuarioGestion } from "api/user"
import {
  getToken,
  getExpiresIn,
  getRefreshToken,
  expiresToUnixTS,
  setToken,
  removeToken,
} from "utils/auth"
import { keysToCamel } from "utils/helpers"
import { resetRouter } from "router"
// import * as types from "../mutation-types";

// state
const state = {
  token: getToken(),
  expiresIn: getExpiresIn(),
  refreshToken: getRefreshToken(),
  user: null,
  userArea: {},
  userNivel: "",
  userVinculacion: {
    jefes: [],
    reportantes: [],
    pares: [],
  },
  userSistemas: [],
  gerentes: [],
  // roles: [],
}

// getters
const getters = {
  token: state => state.token,
  expiresIn: state => state.expiresIn,
  refreshToken: state => state.refreshToken,
  user: state => state.user,
  userId: state => (state.user ? state.user.id : null),
  userRazonSocial: state => (state.user ? state.user.razonSocial : "Usuario"),
  // roles: state => state.roles,
  check: state => state.user !== null,
  // userTreeLoaded: state => !_.isEmpty(state.userVinculacion),
  userJefes: state => state.userVinculacion && state.userVinculacion.jefes,
  userReportantes: state => {
    const userReps = _.get(state, "userVinculacion.reportantes", [])
    return _.map(userReps, ur => {
      return {
        label: ur.razonSocial,
        value: ur.usuarioId,
      }
    })
  },
  userReportantesNoOperativos: state => {
    const userReps = _.get(state, "userVinculacion.reportantes", [])
    return _(userReps)
      .filter(ur => ur.nivel !== "Operativo")
      .map(ur => ({
        label: ur.razonSocial,
        value: ur.usuarioId,
      }))
      .value()
  },
  userYoYReportantes: (state, getters) => {
    const ur = [...getters.userReportantes]
    const currentUser = state.user || {}
    ur.push({
      label: currentUser.razonSocial,
      value: currentUser.id,
    })
    return _.orderBy(ur, ["label"], ["asc"])
  },
  userPares: state => {
    const userPares = _.get(state, "userVinculacion.pares", [])
    return _.map(userPares, ur => {
      return {
        label: ur.razonSocial,
        value: ur.usuarioId,
      }
    })
  },
  userParesYReportantes: (state, getters) => {
    const users = [...getters.userReportantes, ...getters.userPares]
    return _.orderBy(users, ["label"], ["asc"])
  },
  userYoParesYReportantes: (state, getters) => {
    const users = [...getters.userParesYReportantes]
    const currentUser = state.user || {}
    users.push({
      label: currentUser.razonSocial,
      value: currentUser.id,
    })
    return _.orderBy(users, ["label"], ["asc"])
  },
  hasJefes: (state, getters) =>
    getters.userJefes && getters.userJefes.length > 0,
  hasReportantes: (state, getters) =>
    getters.userReportantes && getters.userReportantes.length > 0,
  hasReportantesNoOperativos: (state, getters) => {
    const userReps = _.get(state, "userVinculacion.reportantes", [])
    return (
      getters.hasReportantes && _.some(userReps, ur => ur.nivel !== "Operativo")
    )
  },

  // Si no tiene reportantes, será el ultimo eslabon de la cadena de mando
  esElUltimoDeLaCadenaDeMando: state => state.userNivel === "Operativo",
  userSistemas: state => state.userSistemas,
  userEsResponsable: state => state.userSistemas.length > 0,
  puedeVerRequerimientosAsignados: state => {
    // valiamos que el area a la que pertece el usuario sea una de las areas a las cuales se les pueden asignar requerimientos
    const userPerteneceAreaConReqsAsignables =
      _.filter([8, 16, 36, 37, 48], id => id == state.userArea.id).length > 0
    // y que ademas el usuario en cuestion no sea gerente ni presidente:
    return (
      userPerteneceAreaConReqsAsignables &&
      state.userNivel !== "Gerente" &&
      state.userNivel !== "Presidente"
    )
  },

  userEsResponsableDeProcesos: state =>
    _.find(state.userSistemas, { id: 13 }) !== undefined,
  esDeSistemasOProcesos: state =>
    _.filter([36, 48], id => id == state.userArea.id).length > 0,
  gerentesOrderByArea: state => {
    // return _.groupBy(state.gerentes, "area.descripcion")
    return _.orderBy(state.gerentes, ["area.descripcion", "razon_social"])
  },
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
      state.userNivel = ""
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
      state.userVinculacion.jefes = keysToCamel(userData.jefes)
      state.userVinculacion.reportantes = keysToCamel(userData.reportantes)
      state.userVinculacion.pares = keysToCamel(userData.pares)
      state.userNivel = userData.nivel
    }
  },
  SET_GERENTES: (state, data) => {
    state.gerentes = data
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
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await login(userInfo)
        // console.log("loginData", data)
        const expires = expiresToUnixTS(data.expires_in)
        commit("SET_TOKEN", {
          token: data.access_token,
          expiresIn: expires,
          refreshToken: data.refresh_token,
        })
        setToken(data.access_token, expires, data.refresh_token)
        commit("app/FLUSH_NOTIFICACIONES", null, { root: true })

        const userData = await getUsuarioGestion()
        commit("SET_USER", userData)

        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },
  getUserInfo({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userData = await getUsuarioGestion()
        commit("SET_USER", userData)

        resolve()
      } catch (error) {
        // TODO: cuando falla al cargar la info del usuario, devolver un error que especifique qu ehayproblemas con el servidor y que vuelva a intentar mas tarde
        reject(error)
      }
    })
  },
  loginHorus({ commit }, { access_token, expires_in, refresh_token }) {
    return new Promise(async (resolve, reject) => {
      try {
        const expires = expiresToUnixTS(expires_in)
        commit("SET_TOKEN", {
          token: access_token,
          expiresIn: expires,
          refreshToken: refresh_token,
        })
        setToken(access_token, expires, refresh_token)
        commit("app/FLUSH_NOTIFICACIONES", null, { root: true })

        const userData = await getUsuarioGestion()
        commit("SET_USER", userData)

        resolve()
      } catch (e) {
        reject(e)
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
